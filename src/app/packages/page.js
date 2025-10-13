"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setError, setLoading, setPlans } from "@/features/plans/planSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function PackagesPage() {
  const router = useRouter();
  const { plans, loading, error } = useSelector((state) => state.plans);
  const dispatch = useDispatch();

  // Fetch plans from API
  const fetchPlans = useCallback(async () => {
    dispatch(setLoading());

    try {
      const response = await axios.get("/api/admin/planRoute");
      console.log(response);
      dispatch(setPlans(response.data.plans));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePlanSelect = async (plan) => {
    try {
      // Payment processing logic
      alert(
        `You selected ${plan.name} plan for ₹${plan.price}. Redirecting to payment...`
      );

      // After successful payment, update user data
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      userData.planPurchased = true;
      userData.currentPlan = plan._id;
      localStorage.setItem("userData", JSON.stringify(userData));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      alert("Payment failed. Please try again.");
    }
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
  if (!loading && plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Plans Available
          </h1>
          <p className="text-gray-600 mb-6">
            Currently there are no active plans available. Please check back
            later or contact administrator.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan to start your MLM journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? "ring-2 ring-purple-500 shadow-2xl" : "shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div
                className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
                  plan.popular ? "border-2 border-purple-500" : ""
                }`}
              >
                <h3
                  className={`text-2xl font-bold text-center mb-4 ${
                    plan.color === "blue"
                      ? "text-blue-600"
                      : plan.color === "purple"
                      ? "text-purple-600"
                      : plan.color === "green"
                      ? "text-green-600"
                      : plan.color === "red"
                      ? "text-red-600"
                      : plan.color === "orange"
                      ? "text-orange-600"
                      : "text-indigo-600"
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.duration}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className={`w-5 h-5 mr-3 ${
                          plan.color === "blue"
                            ? "text-blue-500"
                            : plan.color === "purple"
                            ? "text-purple-500"
                            : plan.color === "green"
                            ? "text-green-500"
                            : plan.color === "red"
                            ? "text-red-500"
                            : plan.color === "orange"
                            ? "text-orange-500"
                            : "text-indigo-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    plan.popular
                      ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
                      : plan.color === "blue"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : plan.color === "green"
                      ? "bg-green-600 hover:bg-green-700"
                      : plan.color === "red"
                      ? "bg-red-600 hover:bg-red-700"
                      : plan.color === "orange"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transform hover:scale-105`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}