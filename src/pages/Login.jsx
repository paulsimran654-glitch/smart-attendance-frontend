import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("All fields are required");
    return;
  }

  setLoading(true);

  const result = await login(email, password);

  if (!result.success) {
    setError(result.message);
    setLoading(false);
    return;
  }

  navigate("/");
};

  async function handleGoogleSuccess(credentialResponse) {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-bold text-[#0B1F3A] mb-2">
            Login
          </h1>

          <p className="text-gray-600 mb-6">
            Welcome Back
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don`t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-linear-to-br from-[#0B1F3A] via-[#102A4C] to-[#1C3D72] text-white flex items-center justify-center">
        <div className="text-center px-10">
          <h2 className="text-5xl font-bold mb-4">
            ATTENDLY
          </h2>
          <p className="text-lg opacity-80">
            "Attendance is the first step to success,
            <br />
            be present to win."
          </p>
        </div>
      </div>

    </div>
  );
}