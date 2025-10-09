// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function page() {
//   const router = useRouter();
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const plans = [
//     {
//       id: 1,
//       name: "BASIC",
//       price: "₹999",
//       duration: "per month",
//       features: [
//         "5 Level Commission",
//         "Basic Support",
//         "Access to Dashboard",
//         "Up to 10 Referrals",
//         "Weekly Payouts"
//       ],
//       popular: false,
//       color: "blue"
//     },
//     {
//       id: 2,
//       name: "PROFESSIONAL",
//       price: "₹2,999",
//       duration: "per month",
//       features: [
//         "10 Level Commission",
//         "Priority Support",
//         "Advanced Analytics",
//         "Up to 50 Referrals",
//         "Daily Payouts",
//         "Training Materials",
//         "Marketing Tools"
//       ],
//       popular: true,
//       color: "purple"
//     },
//     {
//       id: 3,
//       name: "ENTERPRISE",
//       price: "₹5,999",
//       duration: "per month",
//       features: [
//         "Unlimited Levels",
//         "24/7 Dedicated Support",
//         "Custom Reports",
//         "Unlimited Referrals",
//         "Instant Payouts",
//         "API Access",
//         "Custom Training",
//         "White Label Solution"
//       ],
//       popular: false,
//       color: "green"
//     }
//   ];

//   const handlePlanSelect = (planId) => {
//     setSelectedPlan(planId);
//     // Yahan aap payment gateway integrate kar sakte hain
//     alert(`You selected ${plans.find(plan => plan.id === planId).name} plan. Redirecting to payment...`);
//     // router.push('/payment');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Choose Your Plan
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Start your MLM journey with our exclusive packages. Select the plan that best fits your business goals.
//           </p>
//         </div>

//         {/* Plans Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`relative rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
//                 plan.popular 
//                   ? 'ring-2 ring-purple-500 shadow-2xl' 
//                   : 'shadow-lg'
//               }`}
//             >
//               {/* Popular Badge */}
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                   <span className="bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
//                     MOST POPULAR
//                   </span>
//                 </div>
//               )}

//               <div className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
//                 plan.popular ? 'border-2 border-purple-500' : ''
//               }`}>
//                 {/* Plan Name */}
//                 <h3 className={`text-2xl font-bold text-center mb-4 ${
//                   plan.color === 'blue' ? 'text-blue-600' :
//                   plan.color === 'purple' ? 'text-purple-600' :
//                   'text-green-600'
//                 }`}>
//                   {plan.name}
//                 </h3>

//                 {/* Price */}
//                 <div className="text-center mb-6">
//                   <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
//                   <span className="text-gray-600 ml-2">{plan.duration}</span>
//                 </div>

//                 {/* Features List */}
//                 <ul className="space-y-4 mb-8 flex-grow">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-center">
//                       <svg className={`w-5 h-5 mr-3 ${
//                         plan.color === 'blue' ? 'text-blue-500' :
//                         plan.color === 'purple' ? 'text-purple-500' :
//                         'text-green-500'
//                       }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                       </svg>
//                       <span className="text-gray-700">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Select Button */}
//                 <button
//                   onClick={() => handlePlanSelect(plan.id)}
//                   className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
//                     plan.popular
//                       ? 'bg-purple-600 hover:bg-purple-700 shadow-lg'
//                       : plan.color === 'blue'
//                       ? 'bg-blue-600 hover:bg-blue-700'
//                       : 'bg-green-600 hover:bg-green-700'
//                   } transform hover:scale-105`}
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Additional Info */}
//         <div className="text-center mt-16">
//           <p className="text-gray-600 mb-4">
//             🔒 All plans include secure payment and 30-day money-back guarantee
//           </p>
//           <p className="text-gray-500 text-sm">
//             Need help choosing? <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Contact our team</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/packages/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        const data = await response.json();
        // Sirf active plans show karo
        const activePlans = data.filter(plan => plan.isActive);
        setPlans(activePlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = async (plan) => {
    try {
      // Payment processing logic
      alert(`You selected ${plan.name} plan for ₹${plan.price}. Redirecting to payment...`);
      
      // After successful payment, update user data
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.planPurchased = true;
      userData.currentPlan = plan._id;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
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

  // Agar koi active plan nahi hai
  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h1>
          <p className="text-gray-600 mb-6">
            Currently there are no active plans available. Please check back later or contact administrator.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Normal packages page with dynamic plans
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Select the perfect plan to start your MLM journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-2xl' : 'shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
                plan.popular ? 'border-2 border-purple-500' : ''
              }`}>
                <h3 className={`text-2xl font-bold text-center mb-4 ${
                  plan.color === 'blue' ? 'text-blue-600' :
                  plan.color === 'purple' ? 'text-purple-600' :
                  plan.color === 'green' ? 'text-green-600' :
                  plan.color === 'red' ? 'text-red-600' :
                  plan.color === 'orange' ? 'text-orange-600' : 'text-indigo-600'
                }`}>
                  {plan.name}
                </h3>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.duration}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className={`w-5 h-5 mr-3 ${
                        plan.color === 'blue' ? 'text-blue-500' :
                        plan.color === 'purple' ? 'text-purple-500' :
                        plan.color === 'green' ? 'text-green-500' :
                        plan.color === 'red' ? 'text-red-500' :
                        plan.color === 'orange' ? 'text-orange-500' : 'text-indigo-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 shadow-lg'
                      : plan.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : plan.color === 'green'
                      ? 'bg-green-600 hover:bg-green-700'
                      : plan.color === 'red'
                      ? 'bg-red-600 hover:bg-red-700'
                      : plan.color === 'orange'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
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