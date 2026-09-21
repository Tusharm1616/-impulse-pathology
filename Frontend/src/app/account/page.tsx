"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

const tabs = [
  { id: "prescriptions", label: "My Prescription Request", icon: "🧾" },
  { id: "bookings", label: "My Bookings", icon: "🗓️" },
  { id: "address", label: "My Address", icon: "📍" },
  { id: "reports", label: "My Reports", icon: "📁" },
  { id: "membership", label: "My Membership Cards", icon: "💳" },
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "notifications", label: "My Notification", icon: "🔔" },
  { id: "family", label: "My Family Members", icon: "👥" },
];

// Subtle accent colors per tab icon for a clean medical theme
const iconColors: Record<string, string> = {
  prescriptions: "bg-emerald-50 text-emerald-600",
  bookings: "bg-blue-50 text-blue-600",
  address: "bg-amber-50 text-amber-600",
  reports: "bg-indigo-50 text-indigo-600",
  membership: "bg-teal-50 text-teal-600",
  profile: "bg-purple-50 text-purple-600",
  notifications: "bg-rose-50 text-rose-600",
  family: "bg-cyan-50 text-cyan-600",
};

export default function AccountPage() {
  const sp = useSearchParams();
  const active = sp.get("tab") || "prescriptions";
  const current = useMemo(() => tabs.find((t) => t.id === active)?.id || "prescriptions", [active]);

  // Basic data states per tab
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Address management UI state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addresses, setAddresses] = useState<any[]>([]);
  // Family members frontend state
  const [family, setFamily] = useState<any[]>([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [familyForm, setFamilyForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    relation: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        let url = "";
        switch (current) {
          case "prescriptions":
            url = "/prescriptions/list";
            break;
          case "bookings":
            url = "/bookings";
            break;
          case "reports":
            url = "/reports";
            break;
          case "address":
            url = "/addresses";
            break;
          case "membership":
            url = "/memberships";
            break;
          case "family":
            url = "/family";
            break;
          case "notifications":
            url = "/notifications";
            break;
          case "profile":
            url = "/me";
            break;
        }
        if (!url) {
          setData(null);
        } else {
          const json = await apiFetch<any>(url);
          setData(json);
        }
      } catch (e: any) {
        setError(e.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [current]);

  // Helpers for address CRUD
  async function refreshAddresses() {
    // Frontend-only: just sync data from local state to display variable
    setData(addresses);
  }

  function openAddAddress() {
    setEditingId(null);
    setAddressForm({ label: "Home", fullName: "", mobile: "", address: "", city: "", state: "", pincode: "" });
    setShowAddressForm(true);
  }

  function openEditAddress(item: any) {
    setEditingId(item.id);
    setAddressForm({
      label: item.label || item.tag || "Home",
      fullName: item.fullName || item.name || "",
      mobile: item.mobile || item.phone || "",
      address: item.address || item.line1 || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || item.zip || "",
    });
    setShowAddressForm(true);
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { id: editingId || crypto.randomUUID?.() || String(Date.now()), ...addressForm };
      if (editingId) {
        setAddresses((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x)));
      } else {
        setAddresses((prev) => [{ ...payload }, ...prev]);
      }
      setShowAddressForm(false);
      setEditingId(null);
      await refreshAddresses();
    } catch (e: any) {
      setError(e.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    try {
      setDeletingId(id);
      setAddresses((prev) => prev.filter((x) => x.id !== id));
      await refreshAddresses();
    } finally {
      setDeletingId(null);
    }
  }

  // Family CRUD (frontend-only)
  function openAddFamily() {
    setEditingFamilyId(null);
    setFamilyForm({ fullName: "", age: "", gender: "", relation: "" });
    setShowFamilyForm(true);
  }

  function openEditFamily(item: any) {
    setEditingFamilyId(item.id);
    setFamilyForm({ fullName: item.name || item.fullName || "", age: String(item.age || ""), gender: item.gender || "", relation: item.relation || "" });
    setShowFamilyForm(true);
  }

  function handleSaveFamily(e: React.FormEvent) {
    e.preventDefault();
    const payload = { id: editingFamilyId || crypto.randomUUID?.() || String(Date.now()), ...familyForm };
    if (editingFamilyId) {
      setFamily((prev) => prev.map((x) => (x.id === editingFamilyId ? { ...x, ...payload } : x)));
    } else {
      setFamily((prev) => [{ ...payload }, ...prev]);
    }
    setEditingFamilyId(null);
    setShowFamilyForm(false);
  }

  function handleDeleteFamily(id: string) {
    setFamily((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <main className="min-h-[100dvh] bg-[#f8fffb] pt-24 md:pt-28">
      {/* Mobile top bar: title + menu button */}
      <div className="max-w-6xl mx-auto px-4 md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-[#0b2545]">Account</div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[#0b2545] shadow-sm active:scale-[0.98]"
            aria-label="Open menu"
          >
            <span className="text-[#009972]">☰</span>
            <span className="sr-only">Open sidebar</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl p-4 border-r border-emerald-100 transform transition-transform duration-200 ease-out">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-[#0b2545]">Menu</div>
              <button onClick={() => setDrawerOpen(false)} className="rounded-md p-2 hover:bg-gray-100" aria-label="Close">
                ✕
              </button>
            </div>
            <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">👤</div>
                <div>
                  <div className="text-emerald-800 font-semibold truncate">My Account</div>
                  <div className="text-xs text-emerald-700/80">Welcome</div>
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              {tabs.map((t) => (
                <Link
                  key={t.id}
                  href={`/account?tab=${t.id}`}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-shadow shadow-sm hover:shadow-md ${
                    current === t.id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-800 hover:bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <span className={`shrink-0 h-8 w-8 rounded-md flex items-center justify-center ${iconColors[t.id] || "bg-gray-50 text-gray-600"}`}>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block rounded-2xl bg-[#f8fffb] border border-emerald-100 p-4 shadow-sm md:sticky md:top-24 md:h-[calc(100dvh-120px)]">
          <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">👤</div>
              <div>
                <div className="text-emerald-800 font-semibold truncate">My Account</div>
                <div className="text-xs text-emerald-700/80">Welcome</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={`/account?tab=${t.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-shadow shadow-sm hover:shadow-md ${
                  current === t.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-800 hover:bg-emerald-50 border-emerald-200"
                }`}
              >
                <span className={`shrink-0 h-8 w-8 rounded-md flex items-center justify-center ${iconColors[t.id] || "bg-gray-50 text-gray-600"}`}>{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="rounded-2xl bg-white/80 backdrop-blur border border-gray-100 p-8 shadow-md hover:shadow-lg transition-shadow min-h-[60vh] max-w-xl md:max-w-none mx-auto md:mx-0">
          <h1 className="text-2xl font-semibold text-[#0b2545] mb-4">
            {tabs.find((t) => t.id === current)?.label || "Dashboard"}
          </h1>

          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && current === "prescriptions" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((it: any, idx: number) => (
                  <li key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{it.name || it.email || "Unknown"}</div>
                      <div className="text-sm text-gray-600">{it.filename || it.id}</div>
                    </div>
                    <div className="text-sm text-gray-500">{it.storedAt ? new Date(it.storedAt).toLocaleString() : ""}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No prescription requests yet.</div>
            )
          )}

          {!loading && !error && current === "bookings" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((b: any) => (
                  <li key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{b.package || b.title}</div>
                      <div className="text-sm text-gray-600">{b.date} {b.time}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{b.status || "Booked"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No bookings found.</div>
            )
          )}

          {!loading && !error && current === "reports" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((r: any) => (
                  <li key={r.id || r.filename} className="py-3 flex items-center justify-between">
                    <div className="font-medium text-gray-900">{r.test || r.title || r.filename}</div>
                    {r.url && <a className="text-emerald-700 hover:underline" href={r.url} target="_blank">Download</a>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No reports available.</div>
            )
          )}

          {!loading && !error && current === "address" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0b2545]">Saved Addresses</h2>
                <button onClick={openAddAddress} className="hidden md:inline-flex items-center gap-2 bg-[#009972] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition shadow-sm">
                  + Add New Address
                </button>
              </div>

              {/* Address cards */}
              {Array.isArray(data) && data.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {data.map((a: any) => (
                    <li key={a.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#0b2545]">{a.label || "Address"}</div>
                          <div className="mt-1 text-sm text-gray-700">
                            {(a.fullName || a.name) && <div className="font-medium text-gray-900">{a.fullName || a.name}</div>}
                            <div>{a.address || a.line1}{a.line2 ? ", " + a.line2 : ""}</div>
                            <div>{[a.city, a.state, a.pincode || a.zip].filter(Boolean).join(", ")}</div>
                            {(a.mobile || a.phone) && <div className="mt-1 text-gray-600">📞 {a.mobile || a.phone}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditAddress(a)} className="rounded-md border border-[#2c7be5] text-[#2c7be5] px-3 py-1.5 hover:bg-[#2c7be5] hover:text-white transition text-sm">Edit</button>
                          <button onClick={() => handleDeleteAddress(a.id)} disabled={deletingId===a.id} className="rounded-md border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50 transition text-sm">
                            {deletingId===a.id?"Deleting...":"Delete"}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700">No addresses saved.</div>
              )}

              {/* Add/Edit form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-semibold text-[#0b2545]">{editingId ? "Edit Address" : "Add New Address"}</div>
                  <button onClick={showAddressForm?()=>setShowAddressForm(false):openAddAddress} className="md:hidden inline-flex items-center gap-2 bg-[#009972] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition">
                    {showAddressForm?"Close":"+ Add New Address"}
                  </button>
                </div>
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input value={addressForm.fullName} onChange={(e)=>setAddressForm({...addressForm, fullName:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                      <input value={addressForm.mobile} onChange={(e)=>setAddressForm({...addressForm, mobile:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm text-gray-600 mb-1">Complete Address</label>
                      <textarea value={addressForm.address} onChange={(e)=>setAddressForm({...addressForm, address:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" rows={3} required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input value={addressForm.city} onChange={(e)=>setAddressForm({...addressForm, city:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">State</label>
                      <input value={addressForm.state} onChange={(e)=>setAddressForm({...addressForm, state:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                      <input value={addressForm.pincode} onChange={(e)=>setAddressForm({...addressForm, pincode:e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 mt-2">
                      <button type="submit" disabled={saving} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#009972] text-white px-5 py-2.5 rounded-lg hover:bg-[#008262] transition-all shadow-sm active:scale-[0.98]">
                        {saving?"Saving...": editingId?"Update Address":"Save Address"}
                      </button>
                      {editingId && (
                        <button type="button" onClick={()=>{setEditingId(null); setShowAddressForm(false);}} className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-[#0b2545] hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {!loading && !error && current === "membership" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="grid gap-3">
                {data.map((m: any) => (
                  <li key={m.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{m.plan || m.name}</div>
                      <div className="text-sm text-gray-600">Valid till {m.expires}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{m.status || "Active"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No membership cards.</div>
            )
          )}

          {!loading && !error && current === "family" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0b2545]">My Family Members</h2>
                <button onClick={openAddFamily} className="hidden md:inline-flex items-center gap-2 bg-[#009972] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition shadow-sm">
                  + Add Family Member
                </button>
              </div>

              {/* Family cards */}
              {Array.isArray(data) && data.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {data.map((m: any) => (
                    <li key={m.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#0b2545]">{m.fullName || m.name}</div>
                          <div className="mt-1 text-sm text-gray-700">{m.relation || "Relation"}</div>
                          <div className="text-sm text-gray-600">{[m.age && `${m.age} yrs`, m.gender].filter(Boolean).join(" • ")}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditFamily(m)} className="rounded-md border border-[#2c7be5] text-[#2c7be5] px-3 py-1.5 hover:bg-[#2c7be5] hover:text-white transition text-sm">Edit</button>
                          <button onClick={() => handleDeleteFamily(m.id)} className="rounded-md border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50 transition text-sm">Delete</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-700">No family members added.</div>
              )}

              {/* Add/Edit Family form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-semibold text-[#0b2545]">{editingFamilyId ? "Edit Family Member" : "Add Family Member"}</div>
                  <button onClick={showFamilyForm?()=>setShowFamilyForm(false):openAddFamily} className="md:hidden inline-flex items-center gap-2 bg-[#009972] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition">
                    {showFamilyForm?"Close":"+ Add Family Member"}
                  </button>
                </div>
                {showFamilyForm && (
                  <form onSubmit={handleSaveFamily} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input value={familyForm.fullName} onChange={(e)=>setFamilyForm({...familyForm, fullName:e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009972]" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Age</label>
                      <input value={familyForm.age} onChange={(e)=>setFamilyForm({...familyForm, age:e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009972]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Gender</label>
                      <select value={familyForm.gender} onChange={(e)=>setFamilyForm({...familyForm, gender:e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009972]">
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm text-gray-600 mb-1">Relation</label>
                      <select value={familyForm.relation} onChange={(e)=>setFamilyForm({...familyForm, relation:e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009972]">
                        <option value="">Select</option>
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Husband</option>
                        <option>Wife</option>
                        <option>Son</option>
                        <option>Daughter</option>
                        <option>Brother</option>
                        <option>Sister</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 mt-2">
                      <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center bg-[#009972] text-white px-5 py-2.5 rounded-lg hover:bg-[#008262] transition-all shadow-sm active:scale-[0.98]">
                        {editingFamilyId?"Update Member":"Save Member"}
                      </button>
                      {editingFamilyId && (
                        <button type="button" onClick={()=>{setEditingFamilyId(null); setShowFamilyForm(false);}} className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-[#0b2545] hover:bg-gray-50 transition">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {!loading && !error && current === "profile" && (
            data ? (
              <div className="space-y-6">
                {/* Profile header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[#009972] text-white flex items-center justify-center text-2xl">
                      {(data.name || data.email || "U").toString().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-[#0b2545]">{data.name || "User"}</div>
                      <div className="text-gray-600">{data.email || "-"}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <button className="inline-flex items-center justify-center gap-2 bg-[#009972] text-white px-4 py-2 rounded-lg hover:bg-[#008262] transition shadow-sm active:scale-[0.98] w-full sm:w-auto">
                      <span className="hidden sm:inline">Edit Profile</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.862 3.487a1.5 1.5 0 0 1 2.121 0l1.53 1.53a1.5 1.5 0 0 1 0 2.121l-9.9 9.9a1.5 1.5 0 0 1-.707.394l-4.09.918a.75.75 0 0 1-.887-.887l.918-4.09a1.5 1.5 0 0 1 .394-.707l9.9-9.9Z"/><path d="M19.5 10.5v7.125A1.875 1.875 0 0 1 17.625 19.5h-11.25A1.875 1.875 0 0 1 4.5 17.625v-11.25A1.875 1.875 0 0 1 6.375 4.5H13.5"/></svg>
                    </button>
                    <button className="inline-flex items-center justify-center rounded-lg border border-[#2c7be5] text-[#2c7be5] hover:bg-[#2c7be5] hover:text-white transition active:scale-[0.98] w-full sm:w-10 h-10" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.862 3.487a1.5 1.5 0 0 1 2.121 0l1.53 1.53a1.5 1.5 0 0 1 0 2.121l-9.9 9.9a1.5 1.5 0 0 1-.707.394l-4.09.918a.75.75 0 0 1-.887-.887l.918-4.09a1.5 1.5 0 0 1 .394-.707l9.9-9.9Z"/><path d="M19.5 10.5v7.125A1.875 1.875 0 0 1 17.625 19.5h-11.25A1.875 1.875 0 0 1 4.5 17.625v-11.25A1.875 1.875 0 0 1 6.375 4.5H13.5"/></svg>
                    </button>
                  </div>
                </div>

                {/* Personal info */}
                <div>
                  <div className="mb-3 text-sm font-semibold text-[#0b2545]">Personal Information</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Name</div>
                      <div className="font-medium text-gray-900">{data.name || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Gender</div>
                      <div className="font-medium text-gray-900">{data.gender || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Date of Birth</div>
                      <div className="font-medium text-gray-900">{data.dob || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Member ID</div>
                      <div className="font-medium text-gray-900">{data.memberId || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <div className="mb-3 text-sm font-semibold text-[#0b2545]">Contact Information</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{data.email || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">{data.phone || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium text-gray-900">{data.address || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">City</div>
                      <div className="font-medium text-gray-900">{data.city || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* Medical info */}
                <div>
                  <div className="mb-3 text-sm font-semibold text-[#0b2545]">Medical Information</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Blood Group</div>
                      <div className="font-medium text-gray-900">{data.bloodGroup || "-"}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600">Allergies</div>
                      <div className="font-medium text-gray-900">{data.allergies || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">Profile info not available.</div>
            )
          )}

          {!loading && !error && current === "notifications" && (
            Array.isArray(data) && data.length > 0 ? (
              <ul className="divide-y">
                {data.map((n: any) => (
                  <li key={n.id} className="py-3">
                    <div className="font-medium text-gray-900">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-700">No notifications.</div>
            )
          )}
        </section>
      </div>
    </main>
  );
}
