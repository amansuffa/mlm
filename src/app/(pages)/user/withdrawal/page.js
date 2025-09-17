
export default function WithdrawalPage() {
  return (
<>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdrawal</h1>
      <div className="bg-white p-6 rounded shadow">
        <p>Balance: <strong>$1200</strong></p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Request Withdrawal
        </button>
      </div>
</>  );
}
