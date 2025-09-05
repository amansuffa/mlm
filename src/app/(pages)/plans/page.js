import Layout from "@/components/Layout";

export default function PlansPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold">Basic Plan</h2>
          <p>$10/month</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold">Pro Plan</h2>
          <p>$25/month</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold">Elite Plan</h2>
          <p>$50/month</p>
        </div>
      </div>
    </Layout>
  );
}
