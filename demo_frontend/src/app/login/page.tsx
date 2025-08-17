"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [showRPass, setShowRPass] = useState(false);
  const [rPass2, setRPass2] = useState("");
  const [showRPass2, setShowRPass2] = useState(false);
  const [rCode, setRCode] = useState("");
  const [showRCode, setShowRCode] = useState(false);
  const [rError, setRError] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    alert(`Logged in as ${username} (simulation)`);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRError("");
    if (!rUser || !rPass || !rPass2 || !rCode) {
      setRError("Please fill in all fields.");
      return;
    }
    if (rPass !== rPass2) {
      setRError("Passwords do not match.");
      return;
    }
    alert(`Registered ${rUser} with passcode ${rCode} (simulation)`);
    setIsFlipped(false);
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-[#e0e5ec] font-sans px-6 py-6">
      <div style={{ perspective: "1000px" }}>
        <div
          className={`
            relative
            w-[340px] h-[460px]
            transition-transform duration-500
            [transform-style:preserve-3d]
            rounded-2xl
            ${isFlipped ? "rotate-y-180" : ""}
          `}
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* LOGIN SIDE */}
          <div
            className={`
              absolute inset-0
              bg-[#e0e5ec] rounded-2xl
              p-8
              overflow-hidden
              [backface-visibility:hidden]
              flex flex-col h-full
              shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
              transition-shadow duration-500
              ${isFlipped ? "!shadow-none" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-blue-300">Login</h1>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="p-2 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] transition hover:bg-blue-100"
              >
                Go To Register
              </button>
            </div>

            <div className="mt-5 flex flex-col flex-1">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />

              <div className="relative my-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-auto flex flex-col">
                <div className="text-red-300 text-sm text-center h-5 mb-2 transition-all">
                  {error ? (
                    error
                  ) : (
                    <span className="opacity-0">placeholder</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLoginSubmit}
                  className="p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] transition hover:bg-blue-100"
                >
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* REGISTER SIDE */}
          <div
            className={`
              absolute inset-0
              bg-[#e0e5ec] rounded-2xl
              p-8
              overflow-hidden
              [backface-visibility:hidden]
              flex flex-col h-full
              shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
              transition-shadow duration-500
              ${isFlipped ? "" : "!shadow-none"}
            `}
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-blue-300">Register</h1>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className={`p-2 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 transition hover:bg-blue-100 ${
                  isFlipped
                    ? "shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
                    : "shadow-[-6px_6px_10px_#c2c8d0,5px_-5px_10px_#e6f0fa]"
                }`}
              >
                Go To Login
              </button>
            </div>

            <div className="mt-5 flex flex-col flex-1">
              <input
                type="text"
                placeholder="Username"
                value={rUser}
                onChange={(e) => setRUser(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />

              <div className="relative my-2">
                <input
                  type={showRPass ? "text" : "password"}
                  placeholder="Password"
                  value={rPass}
                  onChange={(e) => setRPass(e.target.value)}
                  className="w-full p-3 pr-12 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowRPass(!showRPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-colors"
                >
                  {showRPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative my-2">
                <input
                  type={showRPass2 ? "text" : "password"}
                  placeholder="Confirm password"
                  value={rPass2}
                  onChange={(e) => setRPass2(e.target.value)}
                  className="w-full p-3 pr-12 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowRPass2(!showRPass2)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-colors"
                >
                  {showRPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative my-2">
                <input
                  type={showRCode ? "text" : "password"}
                  placeholder="Passcode"
                  value={rCode}
                  onChange={(e) => setRCode(e.target.value)}
                  className="w-full p-3 pr-12 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowRCode(!showRCode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-colors"
                >
                  {showRCode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-auto flex flex-col">
                <div className="text-red-300 text-sm text-center h-5 mb-2 transition-all">
                  {rError ? (
                    rError
                  ) : (
                    <span className="opacity-0">placeholder</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRegisterSubmit}
                  className={`p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 transition hover:bg-blue-100 ${
                    isFlipped
                      ? "shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
                      : "shadow-[-6px_6px_10px_#c2c8d0,5px_-5px_10px_#e6f0fa]"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
