"use client";

import { useState, useEffect } from "react";
import { FaDownload, FaEye, FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import QRCode from "react-qr-code";

export default function ReportSection() {
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // 🔹 Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // token saved at login
          },
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
  }, []);

  // 🔹 Search filter
  const filteredReports = reports.filter((r) => {
    const patient = r.booking?.user?.name || "";
    const email = r.booking?.user?.email || "";
    const test = r.booking?.service || "";
    return (
      patient.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      test.toLowerCase().includes(search.toLowerCase()) ||
      r._id.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reports</h2>

      {/* 🔍 Search */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by patient, test, or ID..."
          className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="text-gray-500" />
      </div>

      {/* 📑 Reports Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3">Report ID</th>
              <th className="p-3">Test</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report: any) => (
              <tr key={report._id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{report._id}</td>
                <td className="p-3">{report.booking?.service || "N/A"}</td>
                <td className="p-3">{report.booking?.user?.name || "Unknown"}</td>
                <td className="p-3">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td
                  className={`p-3 font-medium ${
                    report.status === "Completed"
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {report.status || "Completed"}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setSelectedReport(report)}
                  >
                    <FaEye />
                  </button>
                  {report.fileUrl && (
                    <a
                      href={report.fileUrl}
                      download
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaDownload />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-3">
              {selectedReport.booking?.service || "Report"}
            </h3>
            <p>
              <strong>Patient:</strong>{" "}
              {selectedReport.booking?.user?.name || "Unknown"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedReport.booking?.user?.email || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedReport.createdAt).toLocaleDateString()}
            </p>
            {selectedReport.notes && (
              <p className="mt-2 p-2 bg-yellow-100 rounded">
                <strong>Doctor’s Note:</strong> {selectedReport.notes}
              </p>
            )}

            {/* Graph */}
            {selectedReport.data?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Result Trend</h4>
                <LineChart
                  width={450}
                  height={250}
                  data={selectedReport.data}
                  className="mx-auto"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            )}

            {/* QR Code */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Verify Report</h4>
              <QRCode value={`https://yourlab.com/verify/${selectedReport._id}`} />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
              {selectedReport.fileUrl && (
                <a
                  href={selectedReport.fileUrl}
                  download
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}