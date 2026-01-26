import DependencyTable from "../components/DependencyTable";
import { dependencies } from "../data/mockData";


export default function Dependencies() {
return (
<div>
<h2 className="text-xl font-semibold mb-4">Dependency List</h2>
<DependencyTable data={dependencies} />
</div>
);
}