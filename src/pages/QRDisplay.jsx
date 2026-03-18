import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import axios from "axios";

export default function QRDisplay() {

  const [qrValue, setQrValue] = useState("");
  const [message, setMessage] = useState("Loading...");

  const fetchQR = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/qr/current"
      );

      const data = res.data;

      if (!data.active) {
        setQrValue("");
        setMessage("QR is not active now");
        return;
      }

      setQrValue(JSON.stringify(data.qr));
      setMessage("");

    } catch (err) {
      console.error(err);
      setMessage("Unable to load QR");
    }
  };

  useEffect(() => {

    fetchQR();

    // 🔁 Auto refresh every 30 seconds
    const interval = setInterval(fetchQR, 30000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        Employee Attendance QR
      </h1>

      <div className="bg-white p-10 rounded-xl shadow">

        {qrValue ? (
          <QRCode value={qrValue} size={260} />
        ) : (
          <p className="text-gray-500 text-lg">
            {message}
          </p>
        )}

      </div>

      <p className="mt-6 text-gray-600">
        Scan this QR to mark attendance
      </p>

    </div>
  );
}