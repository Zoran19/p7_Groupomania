import { SignUpForm } from "./SignUpForm";
import React from "react";
import { SignUpImage } from "./SignUpImage";
import styles from "../../pages/authentification/login.module.scss";
import { LoginImage } from "../login/LoginImage";

export function SignUpScreen() {
  return (
    <div className={styles.alignementRow}>
      <div
        className={`${styles.alignementRow} ${styles.imageLogin} ${styles.totalWidth}`}
      >
        <LoginImage />
      </div>
      <div className={`${styles.totalWidth} ${styles.alignementRow}`}>
        <SignUpForm />
      </div>
    </div>
  );
}
