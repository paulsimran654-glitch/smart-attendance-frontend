import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard({ user }) {

const navigate = useNavigate();

return ( <div className="space-y-6">

  {/* HEADER */}
  <div>
    <h1 className="text-2xl font-bold">
      Hello, {user.name} 👋
    </h1>

    <p className="text-gray-500 text-sm">
      Here's your attendance summary for today
    </p>
  </div>


  {/* TOP CARDS */}
  <div className="grid grid-cols-4 gap-6">

    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">
        Today's Status
      </p>

      <h2 className="text-xl font-semibold text-green-600">
        Present
      </h2>
    </div>


    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">
        Check In
      </p>

      <h2 className="text-xl font-semibold">
        08:55
      </h2>
    </div>


    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">
        Check Out
      </p>

      <h2 className="text-xl font-semibold">
        17:30
      </h2>
    </div>


    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">
        Working Hours
      </p>

      <h2 className="text-xl font-semibold">
        8.58h
      </h2>
    </div>

  </div>


  {/* MAIN SECTION */}
  <div className="grid grid-cols-2 gap-6">


    {/* LEFT PANEL */}
    <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">

      <div className="bg-blue-200 w-16 h-16 flex items-center justify-center rounded-lg mb-4 text-xl">
        ⏰
      </div>

      <h2 className="text-lg font-semibold">
        You're Done for Today
      </h2>

      <p className="text-gray-500 text-sm">
        See you tomorrow!
      </p>

    </div>


    {/* RIGHT PANEL */}
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-semibold mb-4">
        Recent Attendance
      </h2>


      <div className="flex justify-between items-center border-b pb-3 text-sm">

        <div>
          <p>2026-03-03</p>

          <p className="text-gray-500">
            08:55 – 17:30
          </p>
        </div>


        <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
          Present
        </span>

      </div>

    </div>


  </div>

</div>


);
}
