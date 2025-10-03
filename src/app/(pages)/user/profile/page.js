"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        console.log(data);

        if (!data.error) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  return (
    <>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white p-8 px-6 rounded-b-2xl shadow-md">
        <h1 className="text-2xl mb-5 font-bold">My Profile</h1>
       
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto mt-[-40px] bg-white rounded-xl shadow-xl p-8 relative z-10">
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Side: Avatar + Basic Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gray-400 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="mt-2 inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                {user.role || "Member"}
              </span>
            </div>

            {/* Right Side: Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Reffer Id</p>
                  <p className="font-medium text-gray-800">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reffered By</p>
                  <p className="font-medium text-gray-800">{user.referredBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-800">{user.status}</p>
                </div>
               <div>
  <p className="text-sm text-gray-500">Joined</p>
  <p className="font-medium text-gray-800">
    {user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A"}
  </p>
</div>
              </div>

              {/* Buttons */}
              {/* <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                  Edit Profile
                </button>
              </div> */}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}
      </div>
    </>
  );
}
