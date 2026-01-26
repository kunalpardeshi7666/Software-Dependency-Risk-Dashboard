import { Link } from "react-router-dom";


export default function Sidebar() {
return (
<aside className="w-64 bg-gray-900 text-white p-5">
<h2 className="text-lg font-bold mb-6">Menu</h2>
<nav className="space-y-3">
<Link to="/" className="block hover:text-blue-400">Dashboard</Link>
<Link to="/dependencies" className="block hover:text-blue-400">Dependencies</Link>
<Link to="/licenses" className="block hover:text-blue-400">License Risks</Link>
<Link to="/settings" className="block hover:text-blue-400">Settings</Link>
</nav>
</aside>
);
}