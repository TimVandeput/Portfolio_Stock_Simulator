"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";
import Loader from "@/components/ui/Loader";
import { register, login } from "@/lib/api/auth";
import type { RegisterRequest, LoginRequest, Role } from "@/types";
import { getErrorMessage } from "@/lib/utils/errorHandling";

export default function LoginClient() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("ROLE_USER");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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
        setShowLoader(true);
        sessionStorage.setItem("fromLogin", "true");
        router.replace("/home");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(
        errorMessage ||
          "Login failed. Please check your credentials and try again."
      );
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
      const errorMessage = getErrorMessage(error);
      setRStatus({
        message: errorMessage || "Registration failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div
      className="login-container w-full h-full flex items-center justify-center font-sans px-6 py-1"
      style={{
        minHeight: "calc(100vh - 8.5rem)",
      }}
    >
      <div className="login-perspective">
        <div
          className={`
            relative
            w-[340px] h-[500px] sm:w-[320px] sm:h-[480px] xs:w-[300px] xs:h-[460px]
            transition-transform duration-500
            [transform-style:preserve-3d]
            rounded-2xl
            ${isFlipped ? "rotate-y-180" : ""}
          `}
        >
          {/* LOGIN SIDE */}
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
            success={success}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            isLoggingIn={isLoggingIn}
            onSubmit={handleLoginSubmit}
            onFlipToRegister={() => {
              setIsFlipped(true);
              setTimeout(() => {
                setError("");
                setSuccess("");
              }, 500);
            }}
          />

          {/* REGISTER SIDE */}
          <RegisterForm
            rUser={rUser}
            setRUser={setRUser}
            rPass={rPass}
            setRPass={setRPass}
            rPass2={rPass2}
            setRPass2={setRPass2}
            rCode={rCode}
            setRCode={setRCode}
            rStatus={rStatus}
            isRegistering={isRegistering}
            onSubmit={handleRegisterSubmit}
            onFlipToLogin={() => {
              setIsFlipped(false);
              setTimeout(() => {
                setRStatus(null);
              }, 500);
            }}
          />
        </div>
      </div>

      {showLoader && <Loader />}
    </div>
  );
}
