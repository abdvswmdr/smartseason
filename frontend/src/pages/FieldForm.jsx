import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fieldsApi, usersApi } from "../api";

export default function FieldForm() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", crop_type: "", planting_date: "", assigned_to: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    usersApi.agents().then(({ data }) => setAgents(data));
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await fieldsApi.create({
        ...form,
        assigned_to: form.assigned_to || null,
      });
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create field");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/admin")} style={{ cursor: "pointer", background: "none", border: "none", fontSize: 14, color: "#2563eb" }}>
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 18 }}>New Field</h2>
      </header>

      <main style={{ padding: "32px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "24px" }}>
          {error && <p style={{ color: "red", margin: "0 0 12px" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            {[
              { label: "Field Name", name: "name", type: "text", placeholder: "e.g. Kamakis Plot B" },
              { label: "Crop Type", name: "crop_type", type: "text", placeholder: "e.g. Maize" },
              { label: "Planting Date", name: "planting_date", type: "date" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 4 }}>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: "#475569", display: "block", marginBottom: 4 }}>Assign to Agent</label>
              <select name="assigned_to" value={form.assigned_to} onChange={handleChange} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}>
                <option value="">— Unassigned —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={submitting} style={{ width: "100%", padding: "10px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              {submitting ? "Creating..." : "Create Field"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
