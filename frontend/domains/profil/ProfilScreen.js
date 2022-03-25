import React from "react";

import styles from "../../pages/index.module.scss";
import { ProfilForm } from "./ProfilForm";

export function ProfilScreen({ loading, profil, refreshProfil }) {
  return (
    <div className={styles.alignementRow}>
      {loading ? null : (
        <ProfilForm profil={profil} refreshProfil={refreshProfil} />
      )}
    </div>
  );
}
