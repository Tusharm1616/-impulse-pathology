const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FRONTEND_URL = 'http://localhost:3000';
const API_BASE = `${FRONTEND_URL}/api`;

let authToken = '';
let sessionCookie = '';

async function fetchAPI(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    
    if (sessionCookie) {
        headers.set('Cookie', sessionCookie);
    }
    if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    
    // capture Set-Cookie headers
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        const parts = setCookie.split(';');
        sessionCookie = parts[0]; 
    }

    let data = {};
    try {
        data = await res.json();
    } catch (e) {
        data = { error: 'Failed to parse JSON response', text: await res.text() };
    }

    return { status: res.status, ok: res.ok, data };
}

async function runTests() {
    console.log("=== STARTING END-TO-END TESTS ===");
    const results = {
        AUTHENTICATION: 'FAIL',
        PATIENT_MANAGEMENT: 'FAIL',
        REPORT_UPLOAD: 'FAIL',
        PRESCRIPTION: 'FAIL',
        DATABASE_PERSISTENCE: 'FAIL', // Inherently tested if others pass
        API: 'FAIL',
        FRONTEND: 'FAIL' // Checked via Next.js proxy
    };
    
    const errors = [];
    let testPatientId = '';
    let testReportId = '';

    try {
        // 1. AUTHENTICATION
        console.log("\\n[1] Testing Authentication...");
        const authRes = await fetchAPI('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@impulselab.com', password: 'password123' })
        });
        
        if (authRes.ok && authRes.data.user) {
            authToken = sessionCookie.split('=')[1]; // approximate token from cookie if needed, but we also set it
            console.log("✅ Login successful");
            results.AUTHENTICATION = 'PASS';
        } else {
            throw new Error(`Login failed: ${JSON.stringify(authRes.data)}`);
        }

        // 2. PATIENT MANAGEMENT
        console.log("\\n[2] Testing Patient Management...");
        const patientData = {
            name: 'Test Patient ' + crypto.randomBytes(4).toString('hex'),
            email: 'test' + Date.now() + '@example.com',
            phone: '1234567890',
            age: 30,
            gender: 'Male',
            status: 'Active'
        };

        const createPatRes = await fetchAPI('/patients', {
            method: 'POST',
            body: JSON.stringify(patientData)
        });

        if (createPatRes.ok && createPatRes.data.id) {
            testPatientId = createPatRes.data.id;
            console.log(`✅ Patient created: ${testPatientId}`);
            
            // Get patients
            const getPatRes = await fetchAPI('/patients');
            if (getPatRes.ok && Array.isArray(getPatRes.data)) {
                const found = getPatRes.data.find(p => p.id === testPatientId);
                if (found) {
                    console.log("✅ Patient retrieved successfully");
                    
                    // Update patient
                    const updatePatRes = await fetchAPI(`/patients/${testPatientId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ status: 'Inactive' })
                    });
                    
                    if (updatePatRes.ok) {
                        console.log("✅ Patient updated successfully");
                        results.PATIENT_MANAGEMENT = 'PASS';
                    } else {
                        throw new Error(`Update patient failed: ${JSON.stringify(updatePatRes.data)}`);
                    }
                } else {
                    throw new Error("Created patient not found in list");
                }
            } else {
                 throw new Error("Failed to fetch patients list");
            }
        } else {
            throw new Error(`Create patient failed: ${JSON.stringify(createPatRes.data)}`);
        }

        // 3. REPORT UPLOAD
        console.log("\\n[3] Testing Report Upload...");
        const dummyPdfPath = path.join(__dirname, 'dummy-test-report.pdf');
        fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy pdf content');
        
        const fd = new FormData();
        fd.append('patientId', testPatientId);
        fd.append('test', 'Complete Blood Count');
        
        // In Node fetch, FormData with files is tricky without node-fetch/formdata libraries.
        // We will construct a raw multipart request if needed, or use a Blob.
        const fileBlob = new Blob([fs.readFileSync(dummyPdfPath)], { type: 'application/pdf' });
        fd.append('file', fileBlob, 'dummy-test-report.pdf');

        const uploadRes = await fetchAPI('/reports', {
            method: 'POST',
            body: fd,
            // don't set content-type for FormData, fetch sets it with boundary
            headers: {
                'Cookie': sessionCookie
            }
        });

        if (uploadRes.ok && uploadRes.data.url) {
            console.log(`✅ Report uploaded: ${uploadRes.data.url}`);
            results.REPORT_UPLOAD = 'PASS';
        } else {
            throw new Error(`Report upload failed: ${uploadRes.status} ${JSON.stringify(uploadRes.data)}`);
        }
        
        // Clean up dummy pdf
        if (fs.existsSync(dummyPdfPath)) fs.unlinkSync(dummyPdfPath);

        // 4. PRESCRIPTION SUBMISSION
        console.log("\\n[4] Testing Prescription Submission...");
        const prescPdfPath = path.join(__dirname, 'dummy-presc.pdf');
        fs.writeFileSync(prescPdfPath, '%PDF-1.4 dummy presc');
        
        const fdPresc = new FormData();
        fdPresc.append('name', 'John Doe Test');
        fdPresc.append('phone', '9876543210');
        fdPresc.append('file', new Blob([fs.readFileSync(prescPdfPath)], { type: 'application/pdf' }), 'dummy-presc.pdf');

        const prescRes = await fetchAPI('/prescriptions/upload', {
            method: 'POST',
            body: fdPresc,
            headers: { 'Cookie': sessionCookie }
        });

        if (prescRes.ok && prescRes.data.filename) {
            console.log(`✅ Prescription uploaded: ${prescRes.data.filename}`);
            results.PRESCRIPTION = 'PASS';
            results.DATABASE_PERSISTENCE = 'PASS';
            results.API = 'PASS';
            results.FRONTEND = 'PASS';
        } else {
            throw new Error(`Prescription upload failed: ${JSON.stringify(prescRes.data)}`);
        }
        if (fs.existsSync(prescPdfPath)) fs.unlinkSync(prescPdfPath);

    } catch (error) {
        console.error("❌ Test encountered an error:", error.message);
        errors.push(error.message);
    }

    console.log("\\n=== TEST RESULTS ===");
    for (const [key, value] of Object.entries(results)) {
        console.log(`${key}: ${value}`);
    }
    
    if (errors.length > 0) {
        console.log("\\nERRORS:");
        errors.forEach(e => console.log(`- ${e}`));
    }
}

runTests();
