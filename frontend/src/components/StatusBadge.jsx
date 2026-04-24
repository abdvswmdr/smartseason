const styles = {
  Active: { background: "#dcfce7", color: "#166534" },
  "At Risk": { background: "#fef9c3", color: "#854d0e" },
  Completed: { background: "#e0e7ff", color: "#3730a3" },
};

export default function StatusBadge({ status }) {
  return (
    <span style={{ ...styles[status], padding: "2px 10px", borderRadius: 12, fontSize: 13, fontWeight: 600 }}>
      {status}
    </span>
  );
}
