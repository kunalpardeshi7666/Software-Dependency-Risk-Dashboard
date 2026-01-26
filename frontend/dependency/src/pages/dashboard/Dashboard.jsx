
import { StatCard } from "../../components/common/StatCard";
import RiskPieChart from "../../components/charts/RiskPieChart";
import VulnerabilityBarChart from "../../components/charts/VulnerabilityBarChart";

export  function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Risk Overview</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Dependencies" value="124" />
        <StatCard title="High Risk" value="18" color="red" />
        <StatCard title="Medium Risk" value="42" color="yellow" />
        <StatCard title="Low Risk" value="64" color="green" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RiskPieChart />
        <VulnerabilityBarChart />
      </div>
    </>
  );
}
export default Dashboard;