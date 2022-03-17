import { LoginForm } from "./LoginForm";
import React from "react";
import { LoginImage } from "./LoginImage";
import styles from "../../pages/authentification/login.module.scss";

export function LoginScreen(props) {
  return (
    <div className={styles.alignementRow}>
      <div
        style={{ width: "100%" }}
        className={`${styles.alignementRow} ${styles.imageLogin}`}
      >
        <LoginImage />
      </div>
      <div style={{ width: "100%" }} className={styles.alignementRow}>
        <LoginForm />
      </div>
    </div>
  );
}
