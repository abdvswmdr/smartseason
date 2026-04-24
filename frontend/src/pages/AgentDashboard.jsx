import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fieldsApi } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fieldsApi.list()
      .then(({ data }) => setFields(data))
      .catch(() => setError("Failed to load fields"))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const total = fields.length;
  const active = fields.filter((f) => f.status === "Active").length;
  const atRisk = fields.filter((f) => f.status === "At Risk").length;
  const completed = fields.filter((f) => f.status === "Completed").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>SmartSeason — Field Agent</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#64748b" }}>{user.name}</span>
          <button onClick={handleLogout} style={{ fontSize: 13, cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "32px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              <SummaryCard label="My Fields" value={total} />
              <SummaryCard label="Active" value={active} color="#166534" />
              <SummaryCard label="At Risk" value={atRisk} color="#854d0e" />
              <SummaryCard label="Completed" value={completed} color="#3730a3" />
            </div>

            <h3 style={{ margin: "0 0 12px" }}>Assigned Fields</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {fields.map((f) => (
                <div key={f.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{f.crop_type} · {f.stage}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <StatusBadge status={f.status} />
                    <Link to={`/fields/${f.id}`} style={{ fontSize: 13, color: "#2563eb" }}>Update</Link>
                  </div>
                </div>
              ))}
              {fields.length === 0 && (
                <p style={{ color: "#94a3b8" }}>No fields assigned yet.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
