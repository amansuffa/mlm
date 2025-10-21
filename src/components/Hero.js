import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 heading-primary heading-light">
          Build Your Team. Grow Your Income.
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          Join our MLM platform and start building your network today. Earn rewards, 
          bonuses, and commissions by growing your team and helping others succeed.
        </p>

        <div className="flex gap-4">
          <Link href="/signup">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Get Started
            </button>
          </Link>
          <Link href="/about">
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            📈 Grow Your Team
          </h3>
          <p className="text-gray-600">
            Build a strong downline and unlock higher earning potential with every level.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            💰 Earn Rewards
          </h3>
          <p className="text-gray-600">
            Get bonuses, incentives, and commissions as your network expands.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">
            🤝 Help Others Succeed
          </h3>
          <p className="text-gray-600">
            Empower your referrals and grow together as a community.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-purple-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="mb-6 text-lg">
          Take your first step towards financial freedom and success.
        </p>
        <Link href="/signup">
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-md hover:bg-gray-100">
            Join Now
          </button>
        </Link>
      </section>
    </>
  );
}
