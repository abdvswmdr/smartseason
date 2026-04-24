import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fieldsApi } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";

function computeInsights(fields) {
  const total = fields.length;
  const active = fields.filter((f) => f.status === "Active").length;
  const atRisk = fields.filter((f) => f.status === "At Risk").length;
  const completed = fields.filter((f) => f.status === "Completed").length;
  const healthPct = total ? Math.round((active / total) * 100) : 0;

  const agentCount = {};
  fields
    .filter((f) => f.status === "Active" && f.agent_name)
    .forEach((f) => {
      agentCount[f.agent_name] = (agentCount[f.agent_name] || 0) + 1;
    });
  const mostActive = Object.entries(agentCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { total, active, atRisk, completed, healthPct, mostActive };
}

export default function AdminDashboard() {
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

  const { total, active, atRisk, completed, healthPct, mostActive } = computeInsights(fields);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>SmartSeason — Admin</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "#64748b" }}>{user.name}</span>
          <button onClick={handleLogout} style={{ fontSize: 13, cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "32px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              <SummaryCard label="Total Fields" value={total} />
              <SummaryCard label="Active" value={active} color="#166534" />
              <SummaryCard label="At Risk" value={atRisk} color="#854d0e" />
              <SummaryCard label="Completed" value={completed} color="#3730a3" />
            </div>

            <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 24px", flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Crop Health</div>
                <div style={{ background: "#e2e8f0", borderRadius: 99, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${healthPct}%`, background: "#22c55e", height: "100%" }} />
                </div>
                <div style={{ fontSize: 13, marginTop: 6 }}>{healthPct}% of fields are Active</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 24px", flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Most Active Agent</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{mostActive}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>All Fields</h3>
              <Link to="/admin/fields/new">
                <button style={{ cursor: "pointer", padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6 }}>
                  + New Field
                </button>
              </Link>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <thead style={{ background: "#f1f5f9" }}>
                <tr>
                  {["Field", "Crop", "Stage", "Status", "Agent", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 13, color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
                  <tr key={f.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{f.name}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{f.crop_type}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{f.stage}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={f.status} /></td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{f.agent_name || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link to={`/fields/${f.id}`} style={{ fontSize: 13, color: "#2563eb" }}>View</Link>
                    </td>
                  </tr>
                ))}
                {fields.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>No fields yet.</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
