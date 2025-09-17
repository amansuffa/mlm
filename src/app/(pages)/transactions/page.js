
export default function TransactionsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <ul className="space-y-2">
          <li className="p-2 border-b">#1001 – $200 – ✅ Completed</li>
          <li className="p-2 border-b">#1002 – $150 – ⏳ Pending</li>
          <li className="p-2">#1003 – $90 – ❌ Failed</li>
        </ul>
      </div>
      </>
  );
}


// import { auth } from "@/auth";
// import { getTransactionsForUser } from "@/app/api/transactions";

// export default async function TransactionsPage() {
//   const session = await auth();
//   const user = session?.user;

//   if (!user) {
//     return <div>Unauthorized</div>; // or redirect
//   }

//   const transactions = await getTransactionsForUser(user);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         {user.role === "superadmin"
//           ? "All Transactions"
//           : user.role === "admin"
//           ? "Team Transactions"
//           : "My Transactions"}
//       </h1>

//       {transactions.length === 0 ? (
//         <p>No transactions found.</p>
//       ) : (
//         <ul className="space-y-2">
//           {transactions.map((tx) => (
//             <li key={tx.id} className="bg-white shadow p-4 rounded">
//               {tx.description} - ${tx.amount}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
