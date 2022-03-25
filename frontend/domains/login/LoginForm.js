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

export function LoginForm() {
  const { cache } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //const onSubmit = (data) => console.log(data);
  const router = useRouter();

  const submit = async (data) => {
    const loginData = await fetchApi("users/login", "POST", {
      email: data.email,
      password: data.password,
    });
    localStorage.setItem("jwt_token", loginData.token);
    console.log(loginData);
    console.log(loginData.token);
    cache.clear();

    router.push("/");
  };

  console.log(errors);
  return (
    <Grid item pt={5} pb={5}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.containerForm}
      >
        <Grid item pb={2} pt={2} m={0} style={{ width: "100%" }}>
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
                      message: "format email attendu", // JS only: <p>error message</p> TS only support string
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
            style={{ borderBottom: "1px solid grey", width: "100%" }}
            pb={2}
            mb={3}
            container
            alignItems="center"
            justifyContent={"center"}
          >
            <Typography color="primary">
              <a href={"/"}>Mot de passe oublié ?</a>
            </Typography>
          </Grid>

          <Grid item xs={12} pb={1} className={styles.alignementRow}>
            <Link href="/authentification/signUp">
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                style={{ paddingTop: "15px", paddingBottom: "15px" }}
              >
                Créer un nouveau compte
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
