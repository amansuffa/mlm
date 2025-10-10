// app/admin/plans/page.js
"use client";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import PlanModal from "@/components/PlanModal";
import { setError, setLoading, setPlans } from "@/features/plans/planSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function ManagePlansPage() {
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlan, setDeletePlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { plans, loading, error } = useSelector((state) => state.plans);
    const dispatch = useDispatch();


  // Fetch plans from API
  const fetchPlans = async () => {
    dispatch(setLoading()); 

    try {
      const response = await axios.get("/api/admin/planRoute");
      console.log(response)
      dispatch(setPlans(response.data.plans)); 
    } catch (error) {
      dispatch(setError(error.message)); 
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  console.log(plans);

  // Add New Plan
  const handleAddPlan = async (planData) => {
    try {
      const response = await fetch("/api/admin/planRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });
      console.log("Add Plan Response:", response);
      if (response.ok) {
        fetchPlans();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Error adding plan. Please try again.");
    }
  };

  // Update Existing Plan
  const handleUpdatePlan = async (planData) => {
    console.log("Updating Plan:", planData);
    try {
      const response = await fetch(`/api/admin/planRoute/${planData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        fetchPlans(); // Refresh list
        setIsModalOpen(false);
        setEditingPlan(null);
        alert("Plan successfully updated!");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Error updating plan. Please try again.");
    }
  };

  // Delete Plan Confirmation Show Karega
  const handleDeleteClick = (plan) => {
    setDeletePlan(plan);
    setShowDeleteConfirm(true);
  };

  // Actual Delete Function
  const handleConfirmDelete = async () => {
    if (!deletePlan) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/planRoute/${deletePlan._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state immediately
        setPlans(plans.filter((p) => p._id !== deletePlan._id));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to delete plan"}`);
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Error deleting plan. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePlan(null);
    }
  };

  // Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePlan(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage MLM Plans
            </h1>
            <p className="text-gray-600">
              Add, edit or delete plans for your users
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            className="bg-[#8200DB] hover:bg-[#6E11B0] text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add New Plan
          </button>
        </div>

        {/* Empty State - Jab koi plan nahi hai */}
        {plans.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Plans Created Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start by creating your first MLM plan. Users will see these plans
              on the packages page.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#8200DB] hover:bg-[#6E11B0] text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Create Your First Plan
            </button>
          </div>
        )}

        {/* Plans Grid - Jab plans hain */}
        {plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{plan.duration}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#6E11B0]">
                    ${plan.price}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-700">
                    Features:
                  </h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.popular
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plan.popular ? "Popular" : "Standard"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 bg-[#8200DB] hover:bg-[#6E11B0] text-white py-2 rounded text-sm transition-colors duration-200 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(plan)}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm transition-colors duration-200 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Plan Modal */}
        {isModalOpen && (
          <PlanModal
            plan={editingPlan}
            onSave={editingPlan ? handleUpdatePlan : handleAddPlan}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPlan(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmation
            plan={deletePlan}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
