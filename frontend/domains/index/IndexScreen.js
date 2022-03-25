import React from "react";

import styles from "../../pages/index.module.scss";
import { IndexForm } from "./IndexForm";
import { IndexPublication } from "./IndexPublication";

export function IndexScreen({ loading, publications, refreshPublications }) {
  return (
    <div className={`${styles.alignementRow} ${styles.containerIndex}`}>
      <IndexForm refreshPublications={refreshPublications} />
      {loading
        ? null
        : publications.map((publication) => (
            <IndexPublication
              key={publication.id}
              publication={publication}
              refreshPublications={refreshPublications}
            />
          ))}
    </div>
  );
}
