"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [rPass2, setRPass2] = useState("");
  const [rCode, setRCode] = useState("");
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
              ${
                isFlipped
                  ? ""
                  : "shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
              }
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

            <form
              className="mt-5 flex flex-col flex-1"
              onSubmit={handleLoginSubmit}
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <div className="text-red-300 text-sm text-center mt-2 transition-all h-5">
                {error ? error : <span className="opacity-0">placeholder</span>}
              </div>
              <button
                type="submit"
                className="mt-auto p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] transition hover:bg-blue-100"
              >
                Login
              </button>
            </form>
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
              ${
                isFlipped
                  ? "shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
                  : ""
              }
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

            <form
              className="mt-5 flex flex-col flex-1"
              onSubmit={handleRegisterSubmit}
            >
              <input
                type="text"
                placeholder="Username"
                value={rUser}
                onChange={(e) => setRUser(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={rPass}
                onChange={(e) => setRPass(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={rPass2}
                onChange={(e) => setRPass2(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <input
                type="text"
                placeholder="Passcode"
                value={rCode}
                onChange={(e) => setRCode(e.target.value)}
                className="my-2 p-3 rounded-xl border-none bg-[#e0e5ec] shadow-inner focus:outline-none text-blue-400 placeholder-blue-300"
              />
              <div className="text-red-300 text-sm text-center mt-2 transition-all h-5">
                {rError ? (
                  rError
                ) : (
                  <span className="opacity-0">placeholder</span>
                )}
              </div>
              <button
                type="submit"
                className={`mt-auto p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 transition hover:bg-blue-100 ${
                  isFlipped
                    ? "shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]"
                    : "shadow-[-6px_6px_10px_#c2c8d0,5px_-5px_10px_#e6f0fa]"
                }`}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
