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
      await fieldsApi.create({ ...form, assigned_to: form.assigned_to || null });
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create field");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <button onClick={() => navigate("/admin")} className="btn-back">← Back</button>
        <h2>New Field</h2>
        <div />
      </header>

      <main className="main-form">
        <div className="card">
          {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            {[
              { label: "Field Name", name: "name", type: "text", placeholder: "e.g. Kamakis Plot B" },
              { label: "Crop Type", name: "crop_type", type: "text", placeholder: "e.g. Maize" },
              { label: "Planting Date", name: "planting_date", type: "date" },
            ].map(({ label, name, type, placeholder }) => (
              <div className="form-group" key={name}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} required />
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Assign to Agent</label>
              <select className="form-select" name="assigned_to" value={form.assigned_to} onChange={handleChange}>
                <option value="">— Unassigned —</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
              {submitting ? "Creating..." : "Create Field"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
