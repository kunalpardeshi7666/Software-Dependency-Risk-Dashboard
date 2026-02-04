export default function Footer() {
  return (
    <footer className="bg-white border-t px-6 py-3 text-sm text-gray-600 flex justify-between">
      <span>© {new Date().getFullYear()} Dependency Risk Dashboard</span>
      <span className="font-medium">All Rights Reserved</span>
    </footer>
  );
}
