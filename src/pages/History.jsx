import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE (DATE FILTER)
  const [selectedDate, setSelectedDate] = useState("");

  // =======================
  // FETCH DATA
  // =======================
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/attendance/history",
          { withCredentials: true }
        );

        setRecords(res.data);

      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =======================
  // CALCULATE HOURS
  // =======================
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";

    const [inH, inM] = checkIn.split(":").map(Number);
    const [outH, outM] = checkOut.split(":").map(Number);

    const inMinutes = inH * 60 + inM;
    const outMinutes = outH * 60 + outM;

    const diff = outMinutes - inMinutes;

    const hours = (diff / 60).toFixed(2);

    return `${hours}h`;
  };

  // =======================
  // STATUS BADGE
  // =======================
  const getStatusBadge = (status) => {
    if (status === "present") return "bg-green-100 text-green-600";
    if (status === "late") return "bg-yellow-100 text-yellow-600";
    if (status === "absent") return "bg-red-100 text-red-600";
  };

  // ✅ FILTER LOGIC
  const filteredRecords = records.filter((item) => {
    if (!selectedDate) return true;

    return (
      new Date(item.date).toISOString().slice(0, 10) === selectedDate
    );
  });

  return (
    <div className="space-y-6">

      {/* HEADER + FILTER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">Attendance History</h1>
          <p className="text-gray-500 text-sm">
            {filteredRecords.length} records
          </p>
        </div>

        {/* ✅ DATE FILTER (RIGHT SIDE) */}
        <input
          type="date"
          className="border px-4 py-2 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : filteredRecords.length === 0 ? (
          <p className="p-4 text-gray-500">No attendance found</p>
        ) : (

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Check In</th>
                <th className="text-left p-4">Check Out</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Hours</th>
              </tr>
            </thead>

            <tbody>

              {filteredRecords.map((item, index) => (
                <tr key={index} className="border-t">

                  <td className="p-4">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>

                  <td className="p-4">
                    {item.checkIn || "-"}
                  </td>

                  <td className="p-4">
                    {item.checkOut || "-"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(item.status)}`}
                    >
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

        )}

      </div>

    </div>
  );
}