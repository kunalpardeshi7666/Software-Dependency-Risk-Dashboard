export default function DependencyTable({ data }) {
    return (
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">License</th>
                    <th className="p-3">Risk</th>
                </tr>
            </thead>
            <tbody>
                {data.map((d, i) => (
                    <tr key={i} className="border-t">
                        <td className="p-3">{d.name}</td>
                        <td className="p-3 text-center">{d.version}</td>
                        <td className="p-3 text-center">{d.license}</td>
                        <td className="p-3 text-center font-semibold text-red-500">{d.risk}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}