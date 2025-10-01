"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PayoutSettingsPage() {
  const { data: session, status } = useSession();
  const [payouts, setPayouts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ type: "bank", details: {}, isPrimary: false });

  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetch(`/api/user/${userId}/payout-settings`)
        .then((res) => res.json())
        .then((data) => setPayouts(data));
    }
  }, [status, userId]);

  if (status === "loading") return <p>Loading page...</p>;
  if (!session) return <p>Please login first.</p>;

  // Save
  const handleSave = async () => {
    const url = `/api/user/${userId}/payout-settings`;
    const method = editingIndex !== null ? "PUT" : "POST";
    const body =
      editingIndex !== null
        ? { index: editingIndex, updatedMethod: form }
        : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setPayouts(data);
    setForm({ type: "bank", details: {}, isPrimary: false });
    setEditingIndex(null);
  };

  // Delete
  const handleDelete = async (index) => {
    const confirmDelete = confirm("Are you sure you want to delete this payout method?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/user/${userId}/payout-settings`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete payout method");
      return;
    }

    setPayouts(data);
  };

  const handleEdit = (index) => {
    setForm(payouts[index]);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setForm({ type: "bank", details: {}, isPrimary: false });
    setEditingIndex(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">💳 Payout Settings</h2>

      {/* List */}
      {payouts.length === 0 ? (
        <p className="text-gray-600 text-center">No payout methods yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {payouts.map((p, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold capitalize text-lg">{p.type}</p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  {Object.entries(p.details).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-medium">{k}:</span> {v}
                    </li>
                  ))}
                </ul>
                {p.isPrimary && (
                  <span className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    ✅ Primary
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(i)}
                  className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="mt-10 p-6 border rounded-lg bg-gray-50 shadow-sm max-w-xl mx-auto">
        <h3 className="font-semibold mb-4 text-lg">
          {editingIndex !== null ? "✏ Edit Method" : "➕ Add Method"}
        </h3>

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value, details: {} })}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="bank">Bank</option>
          <option value="easypaisa">Easypaisa</option>
          <option value="jazzcash">JazzCash</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Crypto</option>
        </select>

        {/* Bank */}
        {form.type === "bank" && (
          <>
            <input
              placeholder="Account Title"
              value={form.details.accountTitle || ""}
              onChange={(e) =>
                setForm({ ...form, details: { ...form.details, accountTitle: e.target.value } })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="IBAN"
              value={form.details.iban || ""}
              onChange={(e) =>
                setForm({ ...form, details: { ...form.details, iban: e.target.value } })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="Bank Name"
              value={form.details.bankName || ""}
              onChange={(e) =>
                setForm({ ...form, details: { ...form.details, bankName: e.target.value } })
              }
              className="border p-2 w-full mb-2 rounded"
            />
          </>
        )}

        {/* Easypaisa / JazzCash */}
        {(form.type === "easypaisa" || form.type === "jazzcash") && (
          <>
            <input
              placeholder="Phone"
              value={form.details.phone || ""}
              onChange={(e) =>
                setForm({ ...form, details: { ...form.details, phone: e.target.value } })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              placeholder="CNIC"
              value={form.details.cnic || ""}
              onChange={(e) =>
                setForm({ ...form, details: { ...form.details, cnic: e.target.value } })
              }
              className="border p-2 w-full mb-2 rounded"
            />
          </>
        )}

        {/* PayPal */}
        {form.type === "paypal" && (
          <input
            placeholder="PayPal Email"
            value={form.details.email || ""}
            onChange={(e) =>
              setForm({ ...form, details: { ...form.details, email: e.target.value } })
            }
            className="border p-2 w-full mb-2 rounded"
          />
        )}

        {/* Crypto */}
        {form.type === "crypto" && (
          <input
            placeholder="Wallet Address"
            value={form.details.wallet || ""}
            onChange={(e) =>
              setForm({ ...form, details: { ...form.details, wallet: e.target.value } })
            }
            className="border p-2 w-full mb-2 rounded"
          />
        )}

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={form.isPrimary}
            onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
          />
          Set as Primary
        </label>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-green-600 text-white rounded w-full hover:bg-green-700"
          >
            {editingIndex !== null ? "Update Method" : "Add Method"}
          </button>
          {editingIndex !== null && (
            <button
              onClick={handleCancelEdit}
              className="px-5 py-2 bg-gray-400 text-white rounded w-full hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
