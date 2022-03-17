import { SignUpForm } from "./SignUpForm";
import React from "react";
import { SignUpImage } from "./SignUpImage";
import styles from "../../pages/authentification/login.module.scss";

export function SignUpScreen(props) {
  return (
    <div className={styles.alignementRow}>
      <div
        style={{ width: "100%" }}
        className={`${styles.alignementRow} ${styles.imageLogin}`}
      >
        <SignUpImage />
      </div>
      <div style={{ width: "100%" }} className={styles.alignementRow}>
        <SignUpForm />
      </div>
    </div>
  );
}
