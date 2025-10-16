export default function Success() {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "50px auto",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#16a34a" }}>✅ Form Submitted Successfully!</h1>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Thank you for your <strong>$50 admin fee payment!</strong>
      </p>
      <p style={{ fontSize: "16px", marginTop: "10px", color: "#444" }}>
        Our team will verify and activate your account manually.
        <br />
        You’ll get an email once it’s approved — then you can log in and send your
        <strong> $500 membership fee</strong> to your sponsor to complete your activation. 🚀
      </p>

      <p style={{ fontSize: "16px", marginTop: "20px", color: "#444" }}>
        Welcome to the movement — your journey to financial freedom starts here! 💎
      </p>

      <div style={{
        marginTop: "30px",
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}>
        <strong>Important:</strong> To ensure our emails are delivered to your inbox,
        please add <strong>info@pash.club</strong> to your contacts list.
      </div>
    </div>
  );
}
