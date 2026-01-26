import RiskCard from "../components/RiskCard";


export default function Dashboard() {
return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<RiskCard title="Total Dependencies" value="42" />
<RiskCard title="High Risk Licenses" value="6" />
<RiskCard title="Security Alerts" value="3" />
</div>
);
}