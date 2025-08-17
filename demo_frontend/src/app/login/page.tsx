"use client";

import { useEffect, useState } from "react";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import ErrorMessage from "@/components/error/ErrorMessage";

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

  const handleLoginSubmit = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    alert(`Logged in as ${username} (simulation)`);
  };

  const handleRegisterSubmit = () => {
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
              <div
                onClick={() => setIsFlipped(true)}
                className="cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium border-b border-transparent hover:border-blue-300"
              >
                Register →
              </div>
            </div>

            <div className="mt-5 flex flex-col flex-1">
              <NeumorphicInput
                type="text"
                placeholder="Username"
                value={username}
                onChange={setUsername}
                className="my-2"
              />

              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={setPassword}
                className="my-2"
              />

              <div className="mt-auto flex flex-col">
                <ErrorMessage message={error} />
                <NeumorphicButton
                  onClick={handleLoginSubmit}
                  className="text-blue-300"
                >
                  Login
                </NeumorphicButton>
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
              <div
                onClick={() => setIsFlipped(false)}
                className="cursor-pointer text-blue-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium border-b border-transparent hover:border-blue-300"
              >
                Login →
              </div>
            </div>

            <div className="mt-5 flex flex-col flex-1">
              <NeumorphicInput
                type="text"
                placeholder="Username"
                value={rUser}
                onChange={setRUser}
                className="my-2"
              />

              <PasswordInput
                placeholder="Password"
                value={rPass}
                onChange={setRPass}
                className="my-2"
              />

              <PasswordInput
                placeholder="Confirm password"
                value={rPass2}
                onChange={setRPass2}
                className="my-2"
              />

              <PasswordInput
                placeholder="Passcode"
                value={rCode}
                onChange={setRCode}
                className="my-2"
              />

              <div className="mt-auto flex flex-col">
                <ErrorMessage message={rError} />
                <NeumorphicButton
                  onClick={handleRegisterSubmit}
                  className="text-blue-300"
                >
                  Register
                </NeumorphicButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
