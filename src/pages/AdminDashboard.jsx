import StatCard from "../components/StatCard";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const chartData = [
  { day: "Mon", present: 6, late: 1, absent: 0 },
  { day: "Tue", present: 5, late: 1, absent: 1 },
  { day: "Wed", present: 6, late: 0, absent: 1 },
  { day: "Thu", present: 4, late: 2, absent: 1 },
  { day: "Fri", present: 5, late: 1, absent: 1 }
];

const activity = [
  { name: "Sarah Johnson", status: "Present", color: "bg-green-100 text-green-600", time: "08:55" },
  { name: "Mike Chen", status: "Late", color: "bg-orange-100 text-orange-600", time: "09:15" },
  { name: "Emily Davis", status: "Present", color: "bg-green-100 text-green-600", time: "08:50" },
  { name: "James Wilson", status: "Absent", color: "bg-red-100 text-red-600", time: "--" },
  { name: "Lisa Anderson", status: "Present", color: "bg-green-100 text-green-600", time: "08:58" }
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Overview of today's attendance
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Total Employees"
          value="7"
          subtitle="+2 this month"
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Present Today"
          value="4"
          subtitle="85.7%"
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Absent Today"
          value="1"
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Late Today"
          value="2"
          icon={Clock}
          color="bg-orange-100 text-orange-600"
        />

      </div>

      {/* Bottom Panels */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Chart */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

          <h3 className="font-semibold mb-4">
            Weekly Attendance
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>

              <XAxis dataKey="day" />
              <YAxis />

              <Tooltip />
              <Legend />

              <Bar dataKey="present" fill="#16a34a" />
              <Bar dataKey="late" fill="#f59e0b" />
              <Bar dataKey="absent" fill="#ef4444" />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Activity */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="font-semibold mb-4">
            Today's Activity
          </h3>

          <div className="space-y-4">

            {activity.map((item, i) => (
              <div key={i} className="flex justify-between items-center">

                <div>
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {item.time}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${item.color}`}
                >
                  {item.status}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;