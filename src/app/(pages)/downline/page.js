import Layout from "@/components/Layout";

export default function DownlinePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Downline</h1>
      <div className="bg-white p-6 rounded shadow">
        <ul className="space-y-2">
          <li>👤 User A – Level 1</li>
          <li>👤 User B – Level 2</li>
          <li>👤 User C – Level 3</li>
        </ul>
      </div>
    </Layout>
  );
}
