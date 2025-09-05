import Layout from "@/components/Layout";

export default function TransactionsPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <ul className="space-y-2">
          <li className="p-2 border-b">#1001 – $200 – ✅ Completed</li>
          <li className="p-2 border-b">#1002 – $150 – ⏳ Pending</li>
          <li className="p-2">#1003 – $90 – ❌ Failed</li>
        </ul>
      </div>
    </Layout>
  );
}
