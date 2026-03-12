export default function History() {

return (

<div className="space-y-6">

  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">
        Attendance History
      </h1>
      <p className="text-gray-500 text-sm">
        1 records
      </p>
    </div>

    <button className="border px-4 py-2 rounded">
      Download Report
    </button>
  </div>


  <div className="bg-white rounded-xl shadow overflow-hidden">

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

        <tr className="border-t">

          <td className="p-4">
            2026-03-03
          </td>

          <td className="p-4">
            08:55
          </td>

          <td className="p-4">
            17:30
          </td>

          <td className="p-4">
            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
              Present
            </span>
          </td>

          <td className="p-4">
            8.58h
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</div>


);

}
