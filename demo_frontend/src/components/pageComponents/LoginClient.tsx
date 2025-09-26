"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";
import Loader from "@/components/ui/Loader";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";

export default function LoginClient() {
  const router = useRouter();
  const { isFlipped, flipToRegister, flipToLogin } = useFormAnimation();

  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="login-container w-full h-full flex items-center justify-center font-sans px-6 py-1"
      style={{
        minHeight: "calc(100vh - 8.5rem)",
      }}
    >
      {loginForm.showLoader ? (
        <Loader />
      ) : (
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
            <LoginForm
              username={loginForm.username}
              setUsername={loginForm.setUsername}
              password={loginForm.password}
              setPassword={loginForm.setPassword}
              error={loginForm.error}
              success={loginForm.success}
              selectedRole={loginForm.selectedRole}
              setSelectedRole={loginForm.setSelectedRole}
              isLoggingIn={loginForm.isLoggingIn}
              onSubmit={loginForm.handleSubmit}
              onFlipToRegister={() => flipToRegister(loginForm.clearMessages)}
            />

            <RegisterForm
              rUser={registerForm.rUser}
              setRUser={registerForm.setRUser}
              rPass={registerForm.rPass}
              setRPass={registerForm.setRPass}
              rPass2={registerForm.rPass2}
              setRPass2={registerForm.setRPass2}
              rCode={registerForm.rCode}
              setRCode={registerForm.setRCode}
              rStatus={registerForm.rStatus}
              isRegistering={registerForm.isRegistering}
              onSubmit={() => registerForm.handleSubmit(() => flipToLogin())}
              onFlipToLogin={() => flipToLogin(registerForm.clearStatus)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
