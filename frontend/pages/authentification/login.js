import React from "react";
import { AuthLayout } from "../../layout/AuthLayout";
import { LoginScreen } from "../../domains/login/LoginScreen";

export default function Login() {
  return (
    <AuthLayout>
      <div>
        <LoginScreen />
      </div>
    </AuthLayout>
  );
}
