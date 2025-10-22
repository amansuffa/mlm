// import Navbar from "@/components/Navbar";
// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <>
//       <Navbar />
//       <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
//         {/* Hero Section */}
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           Build Your Team. Grow Your Income.
//         </h1>
//         <p className="text-lg mb-6 max-w-2xl">
//           Join our MLM platform and start building your network today. Earn rewards, 
//           bonuses, and commissions by growing your team and helping others succeed.
//         </p>

//         <div className="flex gap-4">
//           <Link href="/signup">
//             <button className="px-6 py-3 text-white dark:text-[#181A20] rounded-md dark:bg-yellow-400 font-medium">
//               Get Started
//             </button>
//           </Link>
//           <Link href="/about">
//             <button className="px-6 py-3 rounded-md dark:bg-[#333D4E]">
//               Learn More
//             </button>
//           </Link>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6 text-center">
//         <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//           <h3 className="text-xl font-semibold mb-3">
//             📈 Grow Your Team
//           </h3>
//           <p className="text-gray-600">
//             Build a strong downline and unlock higher earning potential with every level.
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//           <h3 className="text-xl font-semibold mb-3">
//             💰 Earn Rewards
//           </h3>
//           <p className="text-gray-600">
//             Get bonuses, incentives, and commissions as your network expands.
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
//           <h3 className="text-xl font-semibold mb-3">
//             🤝 Help Others Succeed
//           </h3>
//           <p className="text-gray-600">
//             Empower your referrals and grow together as a community.
//           </p>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="text-white text-center py-12">
//         <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
//         <p className="mb-6 text-lg">
//           Take your first step towards financial freedom and success.
//         </p>
//         <Link href="/signup">
//           <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-md hover:bg-gray-100">
//             Join Now
//           </button>
//         </Link>
//       </section>
//     </>
//   );
// }
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build Your Team. Grow Your Income.
        </h1>
        <p className="text-lg mb-6 max-w-2xl">
          Join our MLM platform and start building your network today. Earn rewards, 
          bonuses, and commissions by growing your team and helping others succeed.
        </p>

        <div className="flex gap-4">
          <Link href="/signup">
            <button className="px-6 py-3 dark:bg-yellow-400 text-white dark:text-[#181A20] rounded-md font-medium hover:bg-purple-700 dark:hover:bg-yellow-500 transition-colors">
              Get Started
            </button>
          </Link>
          <Link href="/about">
            <button className="px-6 py-3 custom text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-[#404A5A] transition-colors">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="custom p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">
            📈 Grow Your Team
          </h3>
          <p>
            Build a strong downline and unlock higher earning potential with every level.
          </p>
        </div>

        <div className="custom p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">
            💰 Earn Rewards
          </h3>
          <p>
            Get bonuses, incentives, and commissions as your network expands.
          </p>
        </div>

        <div className="custom p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">
            🤝 Help Others Succeed
          </h3>
          <p>
            Empower your referrals and grow together as a community.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="custom text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="mb-6 text-lg">
          Take your first step towards financial freedom and success.
        </p>
        <Link href="/signup">
          <button className="px-8 py-3 bg-white dark:bg-yellow-400 dark:text-[#181A20] font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-yellow-500 transition-colors">
            Join Now
          </button>
        </Link>
      </section>
    </>
  );
}