import Grid from "@mui/material/Grid";
import React from "react";
import Image from "next/image";

export function SignUpImage() {
  return (
    <Grid item sm={6} pt={5} pb={5}>
      <Image
        src="/images/icon-above-font.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </Grid>
  );
}
