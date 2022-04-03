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
import { useRouter } from "next/router";

export function ProfilForm({ profil, refreshProfil }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const submit = async (data) => {
    const loginData = await fetchApi("users/me", "PUT", {
      bio: data.bio,
    }).then(() => refreshProfil());
    void router.push("/");
  };

  const submitDelete = async () => {
    await fetchApi("users/me", "DELETE")
      .then(() => localStorage.clear())
      .then(() => router.push("/authentification/login"));
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
                  disabled
                  label="Prenom"
                  variant="outlined"
                  name="publication"
                  id="outlined-multiline-static"
                  value={profil.firstName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom"
                  disabled
                  variant="outlined"
                  name="publication"
                  id="outlined-multiline-static"
                  value={profil.lastName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ecrivez votre bio"
                  variant="outlined"
                  name="bio"
                  multiline
                  id="outlined-multiline-static"
                  rows={6}
                  defaultValue={profil.bio}
                  {...register("bio")}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                >
                  modifier profil
                </Button>
              </Grid>
            </Grid>
          </form>

          <Grid item xs={12} pb={1} pt={1} className={styles.alignementRow}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              size="large"
              onClick={() => submitDelete()}
            >
              Supprimer votre compte
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
