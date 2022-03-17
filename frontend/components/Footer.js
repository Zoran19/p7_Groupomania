import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Grid } from "@mui/material";

export function Footer() {
  return (
    <div className={styles.footer}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>powered by</Grid>
        <Grid item>
          <Image
            src="/images/icon-left-font-monochrome-black.png"
            alt="Vercel Logo"
            width={200}
            height={220}
            style={{ marginLeft: "50px" }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
