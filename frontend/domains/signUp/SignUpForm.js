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
import { fetchApi } from "../../api/fetchApi";
import { useSWRConfig } from "swr";

export function SignUpForm() {
  const { cache } = useSWRConfig();
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
      const loginData = await fetchApi("users/login", "POST", {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("jwt_token", loginData.token);

      cache.clear();

      router.push("/");
    });
  };

  return (
    <Grid item p={5}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.containerForm}
      >
        <Grid item pb={2} pt={2} m={0} className={styles.separatorLign}>
          <div
            className={`${styles.imageLoginMobile} ${styles.alignementRow} `}
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
              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12} sm={6}>
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
                <Typography color={"error"}>{errors.email?.message}</Typography>
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
        </Grid>

        <Grid item xs={12} pb={1} pt={2} className={styles.alignementRow}>
          <Link href="/authentification/login">
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
            >
              Déja un compte ? Se connecter
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}
