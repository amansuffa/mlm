"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function PayoutSettingsPage() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    methodName: "",
    details: "",
    isPrimary: false
  });

  const userId = session?.user?.id;
  useEffect(() => {
    const fetchPayoutMethods = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${userId}/payout-settings`);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const r = await res.json();
        const data = r.all;

        console.log('API Response:', data);
        
        const payoutMethods = Array.isArray(data) ? data : [];
        
        // If there are methods but no primary method, set the first one as primary
        if (payoutMethods.length > 0 && !payoutMethods.some(method => method.isPrimary)) {
          payoutMethods[0].isPrimary = true;
        }
        
        setPayouts(payoutMethods);
      } catch (err) {
        console.error("Failed to fetch payout methods:", err);
        toast.error(`Failed to load payout methods: ${err.message}`);
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && userId) {
      fetchPayoutMethods();
    }
  }, [status, userId]);

  const handleSave = async () => {
    if (!form.methodName.trim() || !form.details.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = `/api/user/${userId}/payout-settings`;
      const method = editingIndex !== null ? "PUT" : "POST";
      
      // Prepare the request body
      const body = editingIndex !== null 
        ? {
            index: editingIndex,
            updatedMethod: {
              methodName: form.methodName.trim(),
              details: form.details.trim(),
              isPrimary: form.isPrimary
            }
          }
        : {
            methodName: form.methodName.trim(),
            details: form.details.trim(),
            isPrimary: form.isPrimary
          };

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save payout method");
      }

      const data = await res.json();
      
      // Verify the response data
      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server");
      }

      // Ensure first method is primary if no primary exists
      const updatedPayouts = Array.isArray(data) ? data : [];
      if (updatedPayouts.length > 0 && !updatedPayouts.some(method => method.isPrimary)) {
        updatedPayouts[0].isPrimary = true;
      }
      
      // Update local state
      setPayouts(updatedPayouts);
      setForm({ methodName: "", details: "", isPrimary: false });
      setEditingIndex(null);
      
      // Show success message
      toast.success(
        editingIndex !== null 
          ? "Payout method updated successfully!" 
          : "Payout method added successfully!"
      );
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err.message || "Failed to save payout method");
    }
  };

  const handleDelete = async (index, methodName) => {
    toast(
      (t) => (
        <div className={`flex flex-col space-y-3 text-[var(--text)]`}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span className="font-medium">Delete Payout Method</span>
          </div>
          <p className="text-sm opacity-90">
            Are you sure you want to delete <strong>{methodName}</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await fetch(`/api/user/${userId}/payout-settings`, {
                    method: "DELETE",
                    headers: { 
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                      index,
                      methodName,
                      userId
                    }),
                  });

                  if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || "Delete failed");
                  }

                  const data = await res.json();
                  if (!Array.isArray(data)) {
                    throw new Error("Invalid response from server");
                  }
                  
                  // Ensure first method is primary if no primary exists after deletion
                  const updatedPayouts = Array.isArray(data) ? data : [];
                  if (updatedPayouts.length > 0 && !updatedPayouts.some(method => method.isPrimary)) {
                    updatedPayouts[0].isPrimary = true;
                  }
                  
                  setPayouts(updatedPayouts);
                  toast.success("Payout method deleted successfully!");
                } catch (err) {
                  console.error("Delete failed:", err);
                  toast.error(err.message || "Failed to delete payout method");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-[var(--cardsec)] text-[var(--text)] px-3 py-1 rounded text-sm hover:bg-[var(--border)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          background: theme === 'dark' ? '#1F2937' : 'white',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          color: theme === 'dark' ? 'white' : 'inherit',
        },
      }
    );
  };

  const handleEdit = (index) => {
    const payout = payouts[index];
    if (!payout) {
      toast.error("Could not find payout method to edit");
      return;
    }
    
    // Scroll to the form
    const formElement = document.querySelector('#payout-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Set form data with proper type conversion and validation
    setForm({
      methodName: String(payout.methodName || "").trim(),
      details: String(payout.details || "").trim(),
      isPrimary: Boolean(payout.isPrimary)
    });
    setEditingIndex(index);
    
    // Show a helpful message
    toast.success("Editing payout method - make your changes above");
  };

  const handleCancelEdit = () => {
    setForm({ methodName: "", details: "", isPrimary: false });
    setEditingIndex(null);
  };

  // Enhanced input handlers with focus effects
  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
 
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';

  };

  const handleTextareaFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';

  };

  const handleTextareaBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';

  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg" style={{ color: 'var(--text)' }}>Please login first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div 
            className="rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
            style={{ 
              background: `linear-gradient(135deg, var(--primary), var(--secondary))`
            }}
          >
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Payout Settings
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Manage your payout methods and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="rounded-xl" style={{border: `1px solid var(--border)`}}>
            <div 
              className="rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--card)',
                borderLeftColor: 'var(--primary)',
                borderColor: 'var(--primary)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Payout Methods</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                    {payouts.length}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg bg-[var(--primary)]/20 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: 'var(--primary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div 
          id="payout-form"
          className="rounded-xl shadow-lg p-6 mb-8 transition-all duration-300"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
            {editingIndex !== null ? "✏️ Edit Payout Method" : "➕ Add New Payout Method"}
          </h3>
          
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Method Name
              </label>
              <input
                type="text"
                placeholder="e.g., Bank Transfer, PayPal, etc."
                value={form.methodName}
                onChange={(e) => setForm({ ...form, methodName: e.target.value })}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                style={{ 
                  backgroundColor: `var(--cardsec)`,
                  border: `2px solid var(--border)`,
                  color: 'var(--text)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Details
              </label>
              <textarea
                placeholder="e.g., Account number, email, wallet address, routing number, etc."
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                rows={4}
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300 resize-vertical"
                style={{ 
                  backgroundColor: `var(--cardsec)`,
                  border: `2px solid var(--border)`,
                  color: 'var(--text)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={form.isPrimary}
                onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                className="w-4 h-4 rounded focus:ring-1 transition-all duration-300"
                style={{ 
                  backgroundColor: form.isPrimary ? 'var(--primary)' : 'var(--cardsec)',
                  borderColor: 'var(--border)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
              <span className="opacity-80">Set as primary payout method</span>
            </label>

            <div className="flex space-x-3">
              {editingIndex !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--cardsec)',
                    color: 'var(--text)',
                    border: `1px solid var(--border)`
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!form.methodName.trim() || !form.details.trim()}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'white'
                }}
              >
                {editingIndex !== null ? "Update Method" : "Add Method"}
              </button>
            </div>
          </div>
        </div>

        {/* Payout Methods Table */}
        {loading ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading your payout methods...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300"
             
            >
              <svg
                className="w-12 h-12 transition-colors duration-300"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No payout methods yet
            </h3>
            <p className="mb-6 opacity-80">
              Add your first payout method to start receiving payments
            </p>
          </div>
        ) : (
          <div 
            className="rounded-xl shadow-lg overflow-hidden transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `var(--cardsec)` }}>
                    <th className="text-left py-4 px-6 font-semibold">Method Name</th>
                    <th className="text-left py-4 px-6 font-semibold">Details</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-center py-4 px-6 font-semibold w-48">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout, index) => (
                    <tr 
                      key={index} 
                      className="transition-colors duration-200 hover:opacity-90"
                      style={{ 
                        borderBottom: index !== payouts.length - 1 ? `1px solid var(--border)` : 'none',
                        backgroundColor: `transparent`
                      }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text)' }}>
                            {String(payout.methodName || '')}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="opacity-90">{String(payout.details || '')}</p>
                      </td>
                      <td className="py-4 px-6">
                        {payout.isPrimary ? (
                          <span 
                            className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-600 font-semibold whitespace-nowrap transition-all duration-300"
                          >
                            ✅ Primary
                          </span>
                        ) : (
                          <span 
                            className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/20 text-[var(--primary)] font-semibold whitespace-nowrap transition-all duration-300"
                          >
                            Secondary
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-2 transition-all duration-200 hover:opacity-70"
                            style={{ color: 'var(--primary)' }}
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(index, String(payout.methodName || ''))}
                            className="p-2 transition-all duration-200 hover:opacity-70"
                            style={{ color: '#ef4444' }}
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}