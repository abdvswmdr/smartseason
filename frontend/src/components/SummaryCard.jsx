export default function SummaryCard({ label, value, color }) {
  return (
    <div className="summary-card">
      <div className="value" style={color ? { color } : {}}>{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
