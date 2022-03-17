import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import styles from "../../pages/index.module.scss";
import { Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { fetchApi } from "../../api/fetchApi";

export function IndexForm({ refreshPublications }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    await fetchApi("/publications", "POST", {
      content: data.content,
    })
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.containerForm}>
      <Container>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <form className={styles.totalWidth} onSubmit={handleSubmit(submit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ecriver votre message"
                  variant="outlined"
                  name="content"
                  multiline
                  id="outlined-multiline-static"
                  rows={6}
                  {...register("content", {
                    required: "Ce champ est obligatoire",
                  })}
                />
              </Grid>
              <Typography color={"error"}>{errors.content?.message}</Typography>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Ajouter une image
                </Button>
              </Grid>
            </Grid>{" "}
            <Grid item xs={12} pb={1} className={styles.alignementRow}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
              >
                Créer Publication
              </Button>
            </Grid>
          </form>
        </Grid>
      </Container>
    </div>
  );
}
