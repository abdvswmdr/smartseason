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
      const [{ data: f }, { data: u }] = await Promise.all([
        fieldsApi.get(id),
        fieldsApi.getUpdates(id),
      ]);
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
  if (error) return <p style={{ padding: 32, color: "red" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate(-1)} style={{ cursor: "pointer", background: "none", border: "none", fontSize: 14, color: "#2563eb" }}>
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 18 }}>{field.name}</h2>
        <div />
      </header>

      <main style={{ padding: "32px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Crop</div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>{field.crop_type}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Planting Date</div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>{new Date(field.planting_date).toLocaleDateString()}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Assigned Agent</div>
              <div style={{ fontWeight: 600 }}>{field.agent_name || "—"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>Stage</div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>{field.stage}</div>
              <StatusBadge status={field.status} />
            </div>
          </div>
        </div>

        {user.role === "agent" && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 16px" }}>Log Update</h3>
            {submitError && <p style={{ color: "red", margin: "0 0 12px" }}>{submitError}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 4 }}>Stage</label>
                <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 4 }}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Observations..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
              <button type="submit" disabled={submitting} style={{ padding: "8px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                {submitting ? "Saving..." : "Save Update"}
              </button>
            </form>
          </div>
        )}

        <div>
          <h3 style={{ margin: "0 0 12px" }}>Update History</h3>
          {updates.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No updates yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {updates.map((u) => (
                <div key={u.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{u.stage}</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(u.created_at).toLocaleString()}</span>
                  </div>
                  {u.notes && <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>{u.notes}</p>}
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>by {u.agent_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
