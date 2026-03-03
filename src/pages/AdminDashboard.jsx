export default function AdminDashboard({ user, logout }) {
  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome Admin {user.name} 👑
      </h1>

      <div className="bg-white p-6 rounded shadow mb-4">
        Admin Panel Access
      </div>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}