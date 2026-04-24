const classMap = {
  Active: "badge badge-active",
  "At Risk": "badge badge-atrisk",
  Completed: "badge badge-completed",
};

export default function StatusBadge({ status }) {
  return <span className={classMap[status] || "badge"}>{status}</span>;
}
