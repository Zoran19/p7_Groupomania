import { LoginForm } from "./LoginForm";
import React from "react";
import { LoginImage } from "./LoginImage";
import styles from "../../pages/authentification/login.module.scss";

export function LoginScreen() {
  return (
    <div className={styles.alignementRow}>
      <div
        className={`${styles.alignementRow} ${styles.imageLogin} ${styles.totalWidth}`}
      >
        <LoginImage />
      </div>
      <div className={`${styles.alignementRow}  ${styles.totalWidth}`}>
        <LoginForm />
      </div>
    </div>
  );
}
