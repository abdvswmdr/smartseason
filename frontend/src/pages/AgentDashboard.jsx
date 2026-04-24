import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fieldsApi } from "../api";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";

export default function AgentDashboard() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fieldsApi.list()
      .then(({ data }) => setFields(data))
      .catch(() => setError("Failed to load fields"))
      .finally(() => setLoading(false));
  }, []);

  const total = fields.length;
  const active = fields.filter((f) => f.status === "Active").length;
  const atRisk = fields.filter((f) => f.status === "At Risk").length;
  const completed = fields.filter((f) => f.status === "Completed").length;

  return (
    <Layout title="SmartSeason — Field Agent">
      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading...</p> : (
        <>
          <div className="summary-cards">
            <SummaryCard label="My Fields" value={total} />
            <SummaryCard label="Active" value={active} color="#166534" />
            <SummaryCard label="At Risk" value={atRisk} color="#854d0e" />
            <SummaryCard label="Completed" value={completed} color="#3730a3" />
          </div>

          <h3 style={{ marginBottom: 12 }}>Assigned Fields</h3>

          <div className="field-list">
            {fields.map((f) => (
              <div key={f.id} className="field-card">
                <div className="field-card-info">
                  <div className="name">{f.name}</div>
                  <div className="meta">{f.crop_type} · {f.stage}</div>
                </div>
                <div className="field-card-actions">
                  <StatusBadge status={f.status} />
                  <Link to={`/fields/${f.id}`} className="link">Update</Link>
                </div>
              </div>
            ))}
            {fields.length === 0 && <p className="muted">No fields assigned yet.</p>}
          </div>
        </>
      )}
    </Layout>
  );
}
