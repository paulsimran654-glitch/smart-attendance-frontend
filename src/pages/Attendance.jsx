import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/admin/attendance",
        { withCredentials: true }
      );

      setRecords(res.data);

    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  // HOURS CALCULATION
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";

    const [inH, inM] = checkIn.split(":").map(Number);
    const [outH, outM] = checkOut.split(":").map(Number);

    const diff = (outH * 60 + outM) - (inH * 60 + inM);

    return (diff / 60).toFixed(2) + "h";
  };

  // STATUS STYLE
  const statusStyle = (status) => {
    if (status === "present") return "bg-green-100 text-green-600";
    if (status === "late") return "bg-yellow-100 text-yellow-600";
    if (status === "absent") return "bg-red-100 text-red-600";
  };

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Records</h1>
          <p className="text-gray-500 text-sm">
            {records.length} records
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-4">Employee</th>
              <th className="text-left p-4">Department</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Check In</th>
              <th className="text-left p-4">Check Out</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Hours</th>
            </tr>
          </thead>

          <tbody>

            {records.map((item, i) => (
              <tr key={i} className="border-t">

                <td className="p-4">
                  {item.employee?.name || "-"}
                </td>

                <td className="p-4">
                  {item.employee?.department || "-"}
                </td>

                <td className="p-4">
                  {new Date(item.date).toLocaleDateString("en-IN")}
                </td>

                <td className="p-4">
                  {item.checkIn || "-"}
                </td>

                <td className="p-4">
                  {item.checkOut || "-"}
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${statusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="p-4">
                  {calculateHours(item.checkIn, item.checkOut)}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}