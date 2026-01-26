export function RiskBadge({ level }) {
  const colors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };
  return (
    <span className={`text-white px-2 py-1 rounded ${colors[level]}`}>
      {level}
    </span>
  );
}