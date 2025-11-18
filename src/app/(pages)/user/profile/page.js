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
  const [showSponsorModal, setShowSponsorModal] = useState(false);



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
                      <p className="text-sm font-medium mb-2" style={{ color: 'var(--textSecondary)' }}>
                        Sponsored by
                      </p>
                      {user.sponsor ? (
                        <div className="flex items-center justify-center gap-2">
                          <p className="font-semibold" style={{ color: 'var(--text)' }}>
                            {user.sponsor.name}
                          </p>
                          <button
                            onClick={() => setShowSponsorModal(true)}
                            className="p-1 transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                            style={{ color: 'var(--accent)' }}
                            title="View Profile"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--textSecondary)' }}>No sponsor</p>
                      )}
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

        {/* Sponsor Profile Modal */}
        {showSponsorModal && user?.sponsor && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Sponsor Profile</h2>
                  <button
                    onClick={() => setShowSponsorModal(false)}
                    className="p-2 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--text)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  {user.sponsor.profilePicture ? (
                    <Image
                      src={user.sponsor.profilePicture}
                      alt={user.sponsor.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {user.sponsor.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {user.sponsor.name}
                  </h3>
                  <p className="opacity-70">@{user.sponsor.username}</p>
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: `1px solid var(--border)` }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Social Links</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Email */}
                    <a
                      href={`mailto:${user.sponsor.email || ''}`}
                      className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--cardSecondary)', color: '#EA4335' }}
                      title="Email"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v.273L12 8.91l6.545-4.816v-.273h3.819c.904 0 1.636.732 1.636 1.636z"/>
                      </svg>
                    </a>

                    {/* Facebook */}
                    {user.sponsor.socialMedia?.facebook && user.sponsor.socialMedia.facebook.trim() !== '' ? (
                      <a
                        href={user.sponsor.socialMedia.facebook.startsWith('http') ? user.sponsor.socialMedia.facebook : `https://facebook.com/${user.sponsor.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}
                        title="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    )}

                    {/* Instagram */}
                    {user.sponsor.socialMedia?.instagram && user.sponsor.socialMedia.instagram.trim() !== '' ? (
                      <a
                        href={user.sponsor.socialMedia.instagram.startsWith('http') ? user.sponsor.socialMedia.instagram : `https://instagram.com/${user.sponsor.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}
                        title="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    )}

                    {/* TikTok */}
                    {user.sponsor.socialMedia?.tiktok && user.sponsor.socialMedia.tiktok.trim() !== '' ? (
                      <a
                        href={user.sponsor.socialMedia.tiktok.startsWith('http') ? user.sponsor.socialMedia.tiktok : `https://tiktok.com/@${user.sponsor.socialMedia.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}
                        title="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {user.sponsor.socialMedia?.whatsapp && user.sponsor.socialMedia.whatsapp.trim() !== '' ? (
                      <a
                        href={`https://wa.me/${user.sponsor.socialMedia.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}
                        title="WhatsApp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
