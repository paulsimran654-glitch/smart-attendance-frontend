import {
  LayoutDashboard,
  Users,
  QrCode,
  ClipboardList,
  Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Employees", icon: Users, path: "/admin/employees" },
  { name: "QR Code", icon: QrCode, path: "/admin/qrcode" },
  { name: "Attendance", icon: ClipboardList, path: "/admin/attendance" },
  { name: "Settings", icon: Settings, path: "/admin/settings" }
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">

      <div className="px-6 py-5 text-xl font-bold border-b border-slate-700">
        AttendQR
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-slate-700"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-sm font-medium">Admin User</p>
        <p className="text-xs text-gray-400">admin</p>

        <button className="mt-3 text-sm text-red-400 hover:text-red-300">
          Sign Out
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;