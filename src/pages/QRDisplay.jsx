import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function QRDisplay() {

  const [qrValue, setQrValue] = useState("");

  useEffect(() => {

    const today = new Date().toISOString().split("T")[0];

    const qrData = {
    type: "attendance",
    date: today,
    company: "Attendify",
    token: "ATTENDIFY_QR"
  };

    setQrValue(JSON.stringify(qrData));

  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        Employee Attendance QR
      </h1>

      <div className="bg-white p-10 rounded-xl shadow">

        {qrValue && (
          <QRCode
            value={qrValue}
            size={260}
          />
        )}

      </div>

      <p className="mt-6 text-gray-500">
        Scan this QR to mark attendance
      </p>

    </div>
  );
}