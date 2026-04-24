import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fieldsApi } from "../api";
import Layout from "../components/Layout";
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
    .forEach((f) => { agentCount[f.agent_name] = (agentCount[f.agent_name] || 0) + 1; });
  const mostActive = Object.entries(agentCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { total, active, atRisk, completed, healthPct, mostActive };
}

export default function AdminDashboard() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fieldsApi.list()
      .then(({ data }) => setFields(data))
      .catch(() => setError("Failed to load fields"))
      .finally(() => setLoading(false));
  }, []);

  const { total, active, atRisk, completed, healthPct, mostActive } = computeInsights(fields);

  return (
    <Layout title="SmartSeason — Admin">
      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading...</p> : (
        <>
          <div className="summary-cards">
            <SummaryCard label="Total Fields" value={total} />
            <SummaryCard label="Active" value={active} color="#166534" />
            <SummaryCard label="At Risk" value={atRisk} color="#854d0e" />
            <SummaryCard label="Completed" value={completed} color="#3730a3" />
          </div>

          <div className="insights-row">
            <div className="insight-card">
              <div className="insight-label">Crop Health</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${healthPct}%` }} />
              </div>
              <div className="progress-text">{healthPct}% of fields are Active</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">Most Active Agent</div>
              <div className="insight-value">{mostActive}</div>
            </div>
          </div>

          <div className="section-header">
            <h3>All Fields</h3>
            <Link to="/admin/fields/new">
              <button className="btn btn-primary">+ New Field</button>
            </Link>
          </div>

          <table className="fields-table">
            <thead>
              <tr>
                {["Field", "Crop", "Stage", "Status", "Agent", ""].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id}>
                  <td className="field-name">{f.name}</td>
                  <td>{f.crop_type}</td>
                  <td>{f.stage}</td>
                  <td><StatusBadge status={f.status} /></td>
                  <td>{f.agent_name || "—"}</td>
                  <td><Link to={`/fields/${f.id}`} className="link">View</Link></td>
                </tr>
              ))}
              {fields.length === 0 && (
                <tr><td colSpan={6} className="empty">No fields yet.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
}
