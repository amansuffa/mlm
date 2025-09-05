import Layout from "@/components/Layout";

export default function ReferralsPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Referrals</h1>
      <div className="bg-white p-6 rounded shadow">
        <p>Your referral link:</p>
        <code className="bg-gray-100 p-2 rounded block mt-2">
          https://mysite.com/ref/12345
        </code>
        <ul className="mt-4 space-y-2">
          <li>👤 Referral A – Joined ✅</li>
          <li>👤 Referral B – Pending ⏳</li>
        </ul>
      </div>
    </Layout>
  );
}
