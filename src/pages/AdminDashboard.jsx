import { useEffect, useState } from "react";
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

import axios from "axios";

axios.defaults.withCredentials = true;

const API = "http://localhost:5000/api";

// ================= COMPONENT =================
const AdminDashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [predictions, setPredictions] = useState([]); // ✅ AI

  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {

    const fetchDashboard = async () => {
      try {

        // 1️⃣ Employees
        const usersRes = await axios.get(`${API}/admin/users`);
        const totalEmployees = usersRes.data.length;

        // 2️⃣ Attendance
        const attendanceRes = await axios.get(`${API}/attendance/history`);

        const today = new Date().toISOString().split("T")[0];

        const todayRecords = attendanceRes.data.filter(
          (r) => r.date && r.date.startsWith(today)
        );

        let present = 0;
        let absent = 0;
        let late = 0;

        todayRecords.forEach((r) => {
          if (r.status === "present") present++;
          else if (r.status === "late") late++;
          else if (r.status === "absent") absent++;
        });

        // Stats
        setStats({
          total: totalEmployees,
          present,
          absent,
          late
        });

        // Activity
        const activityData = todayRecords.map((r) => ({
          name: r.employee?.name || "Employee",
          time: r.checkIn || "--",
          status: r.status
        }));

        setActivity(activityData);

        // Weekly Chart
        const last5Days = [];

        for (let i = 4; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);

          const dateStr = d.toISOString().split("T")[0];

          const records = attendanceRes.data.filter((r) =>
            r.date && r.date.startsWith(dateStr)
          );

          let p = 0, l = 0, a = 0;

          records.forEach((r) => {
            if (r.status === "present") p++;
            else if (r.status === "late") l++;
            else if (r.status === "absent") a++;
          });

          last5Days.push({
            day: d.toLocaleDateString("en-US", { weekday: "short" }),
            present: p,
            late: l,
            absent: a
          });
        }

        setChartData(last5Days);

        // ================= AI: Predictions =================
        const predictionRes = await axios.get(`${API}/attendance/predictions`);

        const highRisk = predictionRes.data.filter(p => p.risk === "High");

        setPredictions(highRisk);

      } catch (err) {
        console.error("Admin Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Overview of today's attendance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Total Employees"
          value={stats.total}
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Present Today"
          value={stats.present}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Late Today"
          value={stats.late}
          icon={Clock}
          color="bg-orange-100 text-orange-600"
        />

      </div>

      {/* BOTTOM PANELS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* CHART */}
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

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* TODAY ACTIVITY */}
          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="font-semibold mb-4">
              Today's Activity
            </h3>

            <div className="space-y-4">

              {activity.length > 0 ? activity.map((item, i) => (

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
                    className={`text-xs px-3 py-1 rounded-full ${
                      item.status === "present"
                        ? "bg-green-100 text-green-600"
                        : item.status === "late"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

              )) : (
                <p className="text-sm text-gray-500">
                  No activity today
                </p>
              )}

            </div>

          </div>

          {/* 🧠 AI PANEL */}
          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="font-semibold mb-4">
              ⚠️ High Risk Employees
            </h3>

            {predictions.length > 0 ? predictions.map((emp, i) => (

              <div key={i} className="flex justify-between text-sm mb-3">

                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-gray-400">
                    Late: {emp.lateCount} | Absent: {emp.absentCount}
                  </p>
                </div>

                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  High
                </span>

              </div>

            )) : (
              <p className="text-sm text-gray-500">
                No high-risk employees
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;