import { Link, useLocation } from "react-router-dom";

export default function EmployeeSidebar() {

const location = useLocation();

const linkClass = (path) =>
`flex items-center gap-3 px-4 py-3 rounded-lg ${
      location.pathname.includes(path)
        ? "bg-blue-900"
        : "hover:bg-blue-900"
    }`;

return ( <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">

  <div>

    <div className="text-2xl font-bold p-6 border-b border-gray-700">
      Attendify
    </div>

    <nav className="p-4 space-y-2">

      <Link to="/employee/dashboard" className={linkClass("dashboard")}>
        Dashboard
      </Link>

      <Link to="/employee/scan" className={linkClass("scan")}>
        Scan QR
      </Link>

      <Link to="/employee/history" className={linkClass("history")}>
        History
      </Link>

    </nav>

  </div>

</div>


);
}
