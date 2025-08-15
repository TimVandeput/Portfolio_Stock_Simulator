"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    alert(`Logged in as ${username} (simulation)`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#e0e5ec] font-sans">
      <div className="bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_15px_#c2c8d0,-5px_-5px_10px_#ffffff] w-[340px]">
        <h1 className="text-2xl font-bold text-center mb-5 text-blue-300">
          Welcome
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
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
            className="mt-4 p-3 rounded-xl font-bold bg-[#e0e5ec] text-blue-300 shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#ffffff] transition hover:bg-blue-100"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
