import React from "react";

import styles from "../../pages/index.module.scss";
import { IndexForm } from "./IndexForm";
import { IndexPublication } from "./IndexPublication";

export function IndexScreen({ loading, publications, refreshPublications }) {
  if (publications) {
    let reversePublications = [...publications].reverse();
  }

  return (
    <div className={`${styles.alignementRow} ${styles.containerIndex}`}>
      <IndexForm refreshPublications={refreshPublications} />
      {loading
        ? null
        : reversePublications.map((publication) => (
            <IndexPublication
              id={publication.id}
              key={publication.id}
              publication={publication}
              refreshPublications={refreshPublications}
            />
          ))}
    </div>
  );
}
