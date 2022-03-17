import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import styles from "../../pages/authentification/login.module.scss";
import { Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //const onSubmit = (data) => console.log(data);
  const router = useRouter();

  const submit = async (data) => {
    await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      }),
    }).then(async (response) => {
      const loginData = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }).then((response) => response.json());
      localStorage.setItem("jwt_token", loginData.token);
      void router.push("/");
    });
  };

  return (
    <Grid container sm={6} pt={5} pb={5}>
      <Container
        component="main"
        maxWidth="xs"
        className={styles.containerForm}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            item
            spacing={2}
            xs={10}
            pb={2}
            pt={2}
            m={0}
            style={{ width: "100%" }}
          >
            <div
              style={{ width: "100%" }}
              className={`${styles.imageLoginMobile} ${styles.alignementRow}`}
            >
              <Image
                src="/images/icon-left-font-monochrome-black.svg"
                alt="MobileLogo"
                width={300}
                height={50}
              />
            </div>
            <form onSubmit={handleSubmit(submit)}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Prenom"
                    variant="outlined"
                    name="firstName"
                    autoComplete="firstName"
                    {...register("firstName", {
                      required: "Ce champ est obligatoire",
                    })}
                  />
                  <Typography color={"error"}>
                    {errors.firstName?.message}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="nom"
                    variant="outlined"
                    name="lastName"
                    autoComplete="lastName"
                    {...register("lastName", {
                      required: "Ce champ est obligatoire",
                    })}
                  />
                  <Typography color={"error"}>
                    {errors.lastName?.message}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    autoComplete="email"
                    {...register("email", {
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "format email attendu", // JS only: <p>error message</p> TS only support string
                      },
                      required: "Ce champ est obligatoire",
                    })}
                  />
                  <Typography color={"error"}>
                    {errors.email?.message}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    autoComplete="current-password"
                    label="Mot de passe"
                    variant="outlined"
                    name="password"
                    {...register("password", {
                      required: "Ce champ est obligatoire",
                    })}
                  />
                  <Typography color={"error"}>
                    {errors.password?.message}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Créer compte
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Grid item xs={12} pb={1} className={styles.alignementRow}>
              <Link href="/authentification/login">
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  style={{ paddingTop: "15px", paddingBottom: "15px" }}
                >
                  Déja un compte ? Se connecter
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}
