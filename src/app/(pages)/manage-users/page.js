import Layout from "@/components/Layout";

export default function ManageUsersPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
      <div className="bg-white p-6 rounded shadow">
        <ul className="space-y-2">
          <li>👤 Admin – Role: Super Admin</li>
          <li>👤 User A – Role: Member</li>
          <li>👤 User B – Role: Member</li>
        </ul>
      </div>
    </Layout>
  );
}
