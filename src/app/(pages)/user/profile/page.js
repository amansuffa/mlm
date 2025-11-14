"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import allowedCountries from "@/utils/countries.json";
import countryCodes from "@/utils/countryCodes.json";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    middleName: "",
    lastName: "",
    profilePicture: "",
    phone: { countryCode: "", number: "" },
    address: { country: "", province: "", city: "" },
    socialMedia: { facebook: "", instagram: "", tiktok: "", whatsapp: "" },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);



  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!data.error) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          firstName: data.user.firstName || "",
          middleName: data.user.middleName || "",
          lastName: data.user.lastName || "",
          profilePicture: data.user.profilePicture || "",
          phone: {
            countryCode: data.user.phone?.countryCode || "",
            number: data.user.phone?.number || "",
          },
          address: {
            country: data.user.address?.country || "",
            province: data.user.address?.province || "",
            city: data.user.address?.city || "",
          },
          socialMedia: {
            facebook: data.user.socialMedia?.facebook || "",
            instagram: data.user.socialMedia?.instagram || "",
            tiktok: data.user.socialMedia?.tiktok || "",
            whatsapp: data.user.socialMedia?.whatsapp || "",
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    setLoading(true);
    console.log("Saving form data:", formData);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("API response:", data);

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");

        fetchProfile();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field, value) {
    console.log("Input change:", field, value);
    const keys = field.split(".");
    if (keys.length === 2) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
        };
        console.log("Updated nested field:", updated);
        return updated;
      });
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        console.log("Updated field:", updated);
        return updated;
      });
    }
  }

  async function handleImageUpload(file, folder = "payment-proof") {
    if (!file) return;

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", folder);

      const res = await axios.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      const data = res.data.url;
      console.log("Upload response:", data);

      if (data) {
        setFormData((prev) => ({ ...prev, profilePicture: data }));
        toast.success("✅ Image uploaded successfully!");
      } else {
        toast.error(res.error || "❌ Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${
          user.lastName
        }`
      : user?.name || "User";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div 
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--primary), var(--secondary))`
            }}
          >
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    My Profile
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Manage your complete profile information
                  </p>
                </div>
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  disabled={loading}
                  className="bg-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                  style={{ color: 'var(--primary)' }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        style={{ color: 'var(--primary)' }}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="p-8">
            {user ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div 
                      className="w-40 h-40 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl overflow-hidden border-4"
                      style={{
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                        borderColor: 'var(--card)'
                      }}
                    >
                      {formData.profilePicture || user.profilePicture ? (
                        <Image
                          src={formData.profilePicture || user.profilePicture}
                          alt="Profile"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isEditing && (
                      <label 
                        className="absolute bottom-4 right-4 text-white p-3 rounded-full cursor-pointer transition-all duration-300 shadow-lg"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0])}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    {displayName}
                  </h2>
                  <p className="mb-4" style={{ color: 'var(--textSecondary)' }}>{user.email}</p>

                  <div className="w-full space-y-4">
                    <div 
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--textSecondary)' }}>
                        Account Role
                      </p>
                      <span 
                        className="button inline-block px-3 py-1 text-white rounded-full text-sm font-semibold mt-1"
          
                      >
                        {user.role === "admin" ? "Administrator" : "Member"}
                      </span>
                    </div>

                    <div 
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--textSecondary)' }}>
                        Account Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                          user.status === "fully_active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "membership_paid"
                            ? "bg-blue-100 text-blue-700"
                            : user.status === "admin_fee_paid"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status
                          ?.split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ") || "Free Member"}
                      </span>
                    </div>

                    <div 
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--textSecondary)' }}>
                        Referral ID
                      </p>
                      <p className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                        {user.username}
                      </p>
                    </div>

                    <div 
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--textSecondary)' }}>
                        Member Since
                      </p>
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Profile Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Personal Information */}
                  <div 
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'var(--cardSecondary)' }}
                  >
                    <h3 
                      className="text-xl font-semibold mb-6 pb-3"
                      style={{ 
                        color: 'var(--text)',
                        borderBottom: `1px solid var(--border)`
                      }}
                    >
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          key: "firstName",
                          label: "First Name",
                          required: true,
                        },
                        { key: "lastName", label: "Last Name", required: true },
                        {
                          key: "middleName",
                          label: "Middle Name",
                          required: false,
                        },
                        { key: "name", label: "Display Name", required: false },
                      ].map(({ key, label, required }) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {label}{" "}
                            {required && (
                              <span style={{ color: 'var(--error)' }}>*</span>
                            )}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData[key]}
                              onChange={(e) =>
                                handleInputChange(key, e.target.value)
                              }
                              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: `2px solid var(--border)`,
                                color: 'var(--text)',
                                '--tw-ring-color': 'var(--accent)'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                          ) : (
                            <div 
                              className="rounded-xl px-4 py-3"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: `2px solid var(--border)`
                              }}
                            >
                              <p style={{ color: 'var(--text)' }}>
                                {user[key] || "Not provided"}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div 
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'var(--cardSecondary)' }}
                  >
                    <h3 
                      className="text-xl font-semibold mb-6 pb-3"
                      style={{ 
                        color: 'var(--text)',
                        borderBottom: `1px solid var(--border)`
                      }}
                    >
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                          Country Code
                        </label>
                        {isEditing ? (
                          <select
                            value={formData.phone.countryCode}
                            onChange={(e) =>
                              handleInputChange(
                                "phone.countryCode",
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                            style={{
                              backgroundColor: 'var(--card)',
                              border: `2px solid var(--border)`,
                              color: 'var(--text)',
                              '--tw-ring-color': 'var(--accent)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                          >
                            <option value="">Select Code</option>
                            {countryCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.code} ({item.country})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div 
                            className="rounded-xl px-4 py-3"
                            style={{
                              backgroundColor: 'var(--card)',
                              border: `2px solid var(--border)`
                            }}
                          >
                            <p style={{ color: 'var(--text)' }}>
                              {user.phone?.countryCode || "Not provided"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={formData.phone.number}
                            onChange={(e) =>
                              handleInputChange("phone.number", e.target.value)
                            }
                            placeholder="1234567890"
                            className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                            style={{
                              backgroundColor: 'var(--card)',
                              border: `2px solid var(--border)`,
                              color: 'var(--text)',
                              '--tw-ring-color': 'var(--accent)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                          />
                        ) : (
                          <div 
                            className="rounded-xl px-4 py-3"
                            style={{
                              backgroundColor: 'var(--card)',
                              border: `2px solid var(--border)`
                            }}
                          >
                            <p style={{ color: 'var(--text)' }}>
                              {user.phone?.number || "Not provided"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div 
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'var(--cardSecondary)' }}
                  >
                    <h3 
                      className="text-xl font-semibold mb-6 pb-3"
                      style={{ 
                        color: 'var(--text)',
                        borderBottom: `1px solid var(--border)`
                      }}
                    >
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { key: "country", label: "Country" },
                        { key: "province", label: "Province/State" },
                        { key: "city", label: "City" },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {label}
                          </label>
                          {isEditing ? (
                            key === 'country' ? (
                              <select
                                value={formData.address[key]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `address.${key}`,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                                style={{
                                  backgroundColor: 'var(--card)',
                                  border: `2px solid var(--border)`,
                                  color: 'var(--text)',
                                  '--tw-ring-color': 'var(--accent)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                              >
                                <option value="">Select Country</option>
                                {allowedCountries.map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={formData.address[key]}
                                onChange={(e) =>
                                  handleInputChange(
                                    `address.${key}`,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                                style={{
                                  backgroundColor: 'var(--card)',
                                  border: `2px solid var(--border)`,
                                  color: 'var(--text)',
                                  '--tw-ring-color': 'var(--accent)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                              />
                            )
                          ) : (
                            <div 
                              className="rounded-xl px-4 py-3"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: `2px solid var(--border)`
                              }}
                            >
                              <p style={{ color: 'var(--text)' }}>
                                {user.address?.[key] || "Not provided"}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Media */}
                  <div 
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'var(--cardSecondary)' }}
                  >
                    <h3 
                      className="text-xl font-semibold mb-6 pb-3"
                      style={{ 
                        color: 'var(--text)',
                        borderBottom: `1px solid var(--border)`
                      }}
                    >
                      Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          key: "facebook",
                          label: "Facebook",
                          placeholder: "https://facebook.com/username",
                        },
                        {
                          key: "instagram",
                          label: "Instagram",
                          placeholder: "https://instagram.com/username",
                        },
                        {
                          key: "tiktok",
                          label: "TikTok",
                          placeholder: "https://tiktok.com/@username",
                        },
                        {
                          key: "whatsapp",
                          label: "WhatsApp",
                          placeholder: "+1234567890",
                        },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {label}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.socialMedia[key]}
                              onChange={(e) =>
                                handleInputChange(
                                  `socialMedia.${key}`,
                                  e.target.value
                                )
                              }
                              placeholder={placeholder}
                              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: `2px solid var(--border)`,
                                color: 'var(--text)',
                                '--tw-ring-color': 'var(--accent)'
                              }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                          ) : (
                            <div 
                              className="rounded-xl px-4 py-3"
                              style={{
                                backgroundColor: 'var(--card)',
                                border: `2px solid var(--border)`
                              }}
                            >
                              <p className="break-all" style={{ color: 'var(--text)' }}>
                                {user.socialMedia?.[key] || "Not provided"}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div 
                      className="flex justify-end space-x-4 pt-6"
                      style={{ borderTop: `1px solid var(--border)` }}
                    >
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile();
                        }}
                        className="px-8 py-3 rounded-xl transition-all duration-300 font-semibold"
                        style={{
                          backgroundColor: 'var(--cardSecondary)',
                          color: 'var(--text)',
                          border: `2px solid var(--border)`
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="button text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div 
                  className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto"
                  style={{ borderColor: 'var(--primary)' }}
                ></div>
                <p className="mt-4 text-lg" style={{ color: 'var(--textSecondary)' }}>Loading profile...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
