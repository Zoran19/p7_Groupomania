import React from "react";
import { AuthLayout } from "../../layout/AuthLayout";

import { SignUpScreen } from "../../domains/signUp/SignUpScreen";

export default function SignUp() {
  return (
    <AuthLayout>
      <div>
        <SignUpScreen />
      </div>
    </AuthLayout>
  );
}
