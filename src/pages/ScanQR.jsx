import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function ScanQR() {

  const scannerRef = useRef(null);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const startScanner = async () => {

    if (scannerStarted) return;

    try {

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        alert("No camera found");
        return;
      }

      const cameraId = cameras[0].id;

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },

        async (decodedText) => {

          if (loading) return;

          setLoading(true);

          try {

            // Stop scanner after scan
            await scanner.stop();
            await scanner.clear();
            setScannerStarted(false);

            navigator.geolocation.getCurrentPosition(

              async (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {

                  const res = await axios.post(
                    "http://localhost:5000/api/attendance/scan",
                    {
                      qr: decodedText,
                      latitude,
                      longitude
                    },
                    {
                      withCredentials: true,
                      headers: {
                        "Content-Type": "application/json"
                      }
                    }
                  );

                  // ✅ FIX STARTS HERE
                  const data = res.data;

                  if (data.type === "checkin") {
                    setMessage(
                      `✅ Check-in Successful
Time: ${data.time}
Status: ${data.status}`
                    );
                  } 
                  else if (data.type === "checkout") {
                    setMessage(
                      `✅ Check-out Successful
Time: ${data.time}`
                    );
                  } 
                  else {
                    setMessage("Attendance processed");
                  }
                  // ✅ FIX ENDS HERE

                } catch (err) {

                  console.error(err);

                  setMessage(
                    err?.response?.data?.message || "Scan failed"
                  );

                }

                setLoading(false);

              },

              () => {
                setMessage("Location permission denied");
                setLoading(false);
              }

            );

          } catch (err) {

            console.error(err);
            setMessage("Scanner error");
            setLoading(false);

          }

        }
      );

      setScannerStarted(true);

    } catch (err) {

      console.error("Scanner start error", err);
      alert("Camera could not start. Check browser permissions.");

    }

  };


  const stopScanner = async () => {

    if (scannerRef.current) {

      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}

      setScannerStarted(false);

    }

  };


  return (

    <div className="flex flex-col items-center justify-center h-full">

      <h1 className="text-2xl font-bold mb-6">
        Scan QR to Mark Attendance
      </h1>

      {!scannerStarted && (
        <button
          onClick={startScanner}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Scanner
        </button>
      )}

      <div
        id="reader"
        style={{ width: "350px", marginTop: "20px" }}
      />

      {scannerStarted && (
        <button
          onClick={stopScanner}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Scanner
        </button>
      )}

      {loading && (
        <p className="mt-4 text-gray-500">
          Processing...
        </p>
      )}

      {message && (
        <div className="mt-6 bg-white p-4 rounded shadow text-center whitespace-pre-line">
          {message}
        </div>
      )}

    </div>
  );
}