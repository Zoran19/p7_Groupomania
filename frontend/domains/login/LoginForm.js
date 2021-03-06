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

export function LoginForm() {
  const { cache } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const submit = async (data) => {
    const loginData = await fetchApi("users/login", "POST", {
      email: data.email,
      password: data.password,
    });
    if (loginData.token) {
      localStorage.setItem("jwt_token", loginData.token);
      cache.clear();
      router.push("/");
    }
  };

  return (
    <Grid item p={5} className={styles.totalWidth}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.containerForm}
      >
        <Grid item pb={2} pt={2} m={0}>
          <div className={`${styles.imageLoginMobile} ${styles.alignementRow}`}>
            <Image
              src="/images/icon-left-font-monochrome-black.svg"
              alt="MobileLogo"
              width={300}
              height={50}
            />
          </div>
          <form onSubmit={handleSubmit(submit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  type={"email"}
                  autoComplete="email"
                  {...register("email", {
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "format email attendu",
                    },
                    required: "Ce champ est obligatoire",
                  })}
                />{" "}
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
                />{" "}
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
                  Se Connecter
                </Button>
              </Grid>
            </Grid>
          </form>

          <Grid
            pb={2}
            mb={3}
            container
            alignItems="center"
            justifyContent={"center"}
            className={styles.separatorLign}
          >
            <Typography color="primary" pt={2}>
              <a href={"/"}>Mot de passe oubli?? ?</a>
            </Typography>
          </Grid>

          <Grid item xs={12} pb={1} className={styles.alignementRow}>
            <Link href="/authentification/signUp" passHref>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
              >
                Cr??er un nouveau compte
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
