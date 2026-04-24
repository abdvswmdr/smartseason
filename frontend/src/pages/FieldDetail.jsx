import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fieldsApi } from "../api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const STAGES = ["Planted", "Growing", "Ready", "Harvested"];

export default function FieldDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    Promise.all([fieldsApi.get(id), fieldsApi.getUpdates(id)])
      .then(([{ data: f }, { data: u }]) => {
        setField(f);
        setUpdates(u);
        setStage(f.stage);
      })
      .catch(() => setError("Failed to load field"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await fieldsApi.addUpdate(id, { stage, notes });
      const [{ data: f }, { data: u }] = await Promise.all([fieldsApi.get(id), fieldsApi.getUpdates(id)]);
      setField(f);
      setUpdates(u);
      setNotes("");
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Failed to submit update");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p style={{ padding: 32 }}>Loading...</p>;
  if (error) return <p style={{ padding: 32 }} className="error">{error}</p>;

  return (
    <div className="page">
      <header className="header">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
        <h2>{field.name}</h2>
        <div />
      </header>

      <main className="main-narrow">
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="field-info-grid">
            <div className="info-block">
              <div className="info-label">Crop</div>
              <div className="info-value">{field.crop_type}</div>
              <div className="info-label">Planting Date</div>
              <div className="info-value">{new Date(field.planting_date).toLocaleDateString()}</div>
              <div className="info-label">Assigned Agent</div>
              <div className="info-value">{field.agent_name || "—"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="info-label" style={{ marginBottom: 6 }}>Stage</div>
              <div className="info-value">{field.stage}</div>
              <StatusBadge status={field.status} />
            </div>
          </div>
        </div>

        {user.role === "agent" && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Log Update</h3>
            {submitError && <p className="error" style={{ marginBottom: 12 }}>{submitError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select className="form-select" value={stage} onChange={(e) => setStage(e.target.value)}>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observations..." />
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? "Saving..." : "Save Update"}
              </button>
            </form>
          </div>
        )}

        <h3 style={{ marginBottom: 12 }}>Update History</h3>
        {updates.length === 0 ? (
          <p className="muted">No updates yet.</p>
        ) : (
          <div className="update-list">
            {updates.map((u) => (
              <div key={u.id} className="update-card">
                <div className="update-header">
                  <span className="update-stage">{u.stage}</span>
                  <span className="update-time">{new Date(u.created_at).toLocaleString()}</span>
                </div>
                {u.notes && <p className="update-notes">{u.notes}</p>}
                <div className="update-agent">by {u.agent_name}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
