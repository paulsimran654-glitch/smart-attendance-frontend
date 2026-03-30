import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {

  const [records, setRecords] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

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

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";

    const [inH, inM] = checkIn.split(":").map(Number);
    const [outH, outM] = checkOut.split(":").map(Number);

    const diff = (outH * 60 + outM) - (inH * 60 + inM);

    return (diff / 60).toFixed(2) + "h";
  };

  const statusStyle = (status) => {
    if (status === "present") return "bg-green-100 text-green-600";
    if (status === "late") return "bg-yellow-100 text-yellow-600";
    if (status === "absent") return "bg-red-100 text-red-600";
  };

  const departments = [
    ...new Set(records.map(r => r.employee?.department).filter(Boolean))
  ];

  const fieldMap = {
    name: (item) => item.employee?.name || "",
    department: (item) => item.employee?.department || "",
    date: (item) => item.date,
    status: (item) => item.status || "",
  };

  const filteredRecords = records.filter((item) => {
    const nameMatch = item.employee?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const deptMatch = department
      ? item.employee?.department === department
      : true;

    const dateMatch = date
      ? new Date(item.date).toISOString().slice(0, 10) === date
      : true;

    return nameMatch && deptMatch && dateMatch;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField) return 0;

    let valA = fieldMap[sortField](a);
    let valB = fieldMap[sortField](b);

    if (sortField === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });

  const getArrow = (field) => {
    if (sortField !== field) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, startIndex + recordsPerPage);

  // ✅ SMART DOTS PAGINATION
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="p-6 space-y-6">

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <p className="text-gray-500 text-sm">
          {sortedRecords.length} records
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">

        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by name..."
            className="border px-4 py-2 rounded-lg w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-3">

          <select
            className="border px-4 py-2 rounded-lg"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Depts</option>
            {departments.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>

          <input
            type="date"
            className="border px-4 py-2 rounded-lg"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>

      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full table-fixed text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                Employee{getArrow("name")}
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("department")}>
                Department{getArrow("department")}
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("date")}>
                Date{getArrow("date")}
              </th>
              <th className="p-3 text-left">Check In</th>
              <th className="p-3 text-left">Check Out</th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("status")}>
                Status{getArrow("status")}
              </th>
              <th className="p-3 text-left">Hours</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.employee?.name || "-"}</td>
                  <td className="p-3">{item.employee?.department || "-"}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString("en-IN")}</td>
                  <td className="p-3">{item.checkIn || "-"}</td>
                  <td className="p-3">{item.checkOut || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">{calculateHours(item.checkIn, item.checkOut)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

      {/* PAGINATION WITH DOTS */}
      <div className="max-w-6xl mx-auto flex justify-center items-center gap-2 flex-wrap">

        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}