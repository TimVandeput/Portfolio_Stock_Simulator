"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import RoleSelector from "@/components/button/RoleSelector";
import { register, login } from "@/lib/api/auth";
import type { RegisterRequest, LoginRequest, Role } from "@/types";

export default function LoginClient() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("ROLE_USER");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [rPass2, setRPass2] = useState("");
  const [rCode, setRCode] = useState("");
  const [rStatus, setRStatus] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleLoginSubmit = async () => {
    setError("");
    setSuccess("");
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const loginData: LoginRequest = {
        username,
        password,
        chosenRole: selectedRole,
      };
      const response = await login(loginData);

      setSuccess(`Login successful! Welcome, ${response.username}!`);
      setUsername("");
      setPassword("");

      setTimeout(() => {
        sessionStorage.setItem("fromLogin", "true");
        router.push("/home");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
          ? String((error as any).message)
          : "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setRStatus(null);

    if (!rUser || !rPass || !rPass2 || !rCode) {
      setRStatus({ message: "Please fill in all fields.", type: "error" });
      return;
    }
    if (rPass !== rPass2) {
      setRStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setIsRegistering(true);
    try {
      const registerData: RegisterRequest = {
        username: rUser,
        password: rPass,
        passcode: rCode,
      };
      await register(registerData);

      setRStatus({
        message: `Registration successful! Please log in.`,
        type: "success",
      });
      setRUser("");
      setRPass("");
      setRPass2("");
      setRCode("");

      setTimeout(() => {
        setIsFlipped(false);
        setRStatus(null);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
          ? String((error as any).message)
          : "Registration failed. Please try again.";
      setRStatus({ message: errorMessage, type: "error" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div
      className="login-container flex-1 w-full flex items-center justify-center font-sans px-6 py-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
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
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* LOGIN SIDE */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginSubmit();
            }}
            className={`
              login-card absolute inset-0 rounded-2xl p-8 overflow-hidden
              [backface-visibility:hidden] flex flex-col h-full
              transition-shadow duration-500
              ${isFlipped ? "!shadow-none" : ""}
            `}
            style={{
              backgroundColor: "var(--bg-surface)",
              boxShadow: isFlipped ? "none" : "var(--shadow-large)",
            }}
          >
            <div className="flex justify-between items-start">
              <h1
                className="login-title text-2xl font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                Login
              </h1>
              <div
                onClick={() => {
                  setIsFlipped(true);
                  setTimeout(() => {
                    setError("");
                    setSuccess("");
                  }, 500);
                }}
                className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "transparent",
                }}
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
              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                className="my-2"
              />

              <div className="mt-auto flex flex-col">
                <div className="mb-2 min-h-[20px] max-h-[60px] overflow-hidden">
                  {error && <StatusMessage message={error} className="mb-3" />}
                  {success && (
                    <StatusMessage
                      message={success}
                      type="success"
                      className="mb-1"
                    />
                  )}
                </div>
                <NeumorphicButton
                  type="submit"
                  onClick={handleLoginSubmit}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </NeumorphicButton>
              </div>
            </div>
          </form>

          {/* REGISTER SIDE */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegisterSubmit();
            }}
            className={`
              login-card absolute inset-0 rounded-2xl p-8 overflow-hidden
              [backface-visibility:hidden] flex flex-col h-full
              transition-shadow duration-500
              ${isFlipped ? "" : "!shadow-none"}
            `}
            style={{
              backgroundColor: "var(--bg-surface)",
              boxShadow: isFlipped ? "var(--shadow-large)" : "none",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex justify-between items-start">
              <h1
                className="login-title text-2xl font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                Register
              </h1>
              <div
                onClick={() => {
                  setIsFlipped(false);
                  setTimeout(() => {
                    setRStatus(null);
                  }, 500);
                }}
                className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "transparent",
                }}
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
                placeholder="Passcode"
                value={rCode}
                onChange={setRCode}
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

              <div className="mt-auto flex flex-col">
                <div className="mb-2 min-h-[20px] max-h-[60px] overflow-hidden">
                  {rStatus && (
                    <StatusMessage
                      message={rStatus.message}
                      type={rStatus.type}
                      className="mb-3"
                    />
                  )}
                </div>
                <NeumorphicButton
                  type="submit"
                  onClick={handleRegisterSubmit}
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register"}
                </NeumorphicButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
