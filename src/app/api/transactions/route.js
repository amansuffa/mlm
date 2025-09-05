export async function GET() {
  return Response.json({
    transactions: [
      { id: 1, date: "2025-08-28", name: "Ali", rank: "Silver", amount: 150, status: "Completed" },
      { id: 2, date: "2025-08-27", name: "Hamza", rank: "Bronze", amount: 30, status: "Pending" }
    ]
  });
}
