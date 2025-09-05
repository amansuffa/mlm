import Layout from "@/components/Layout";

export default function ProfilePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
        <p><strong>Rank:</strong> Gold</p>
      </div>
    </Layout>
  );
}
