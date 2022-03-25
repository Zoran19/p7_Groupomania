import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React from "react";
import styles from "../../pages/index.module.scss";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { fetchApi } from "../../api/fetchApi";
import { useForm } from "react-hook-form";
import { IndexCommentary } from "./IndexCommentary";
import { useProfil } from "../../api/useProfil";
import { Typography } from "@mui/material";

export function IndexPublication({ publication, refreshPublications }) {
  const { loading: loadingProfile, data: profile } = useProfil();
  const canEditOrDelete =
    !loadingProfile &&
    profile &&
    (profile.id === publication.UserId || profile.isAdmin === true);

  const [displayEditPublication, setDisplayEditPublication] = useState("none");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitDelete = async () => {
    await fetchApi(`publications/${publication.id}`, "DELETE").then(() =>
      refreshPublications()
    );
  };

  const submitUpdate = async (data2) => {
    console.log("submitUpdate data", data2);
    await fetchApi(`publications/${publication.id}`, "PUT", {
      content: data2.contentFoo,
    })
      .then(() => setDisplayEditPublication("none"))
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.containerForm}>
      <Grid>
        <Grid p={1}>
          {canEditOrDelete ? (
            <Grid
              container
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Grid item>
                <Button
                  type="submit"
                  onClick={() => {
                    if (displayEditPublication === "none") {
                      setDisplayEditPublication("flex");
                    } else setDisplayEditPublication("none");
                  }}
                >
                  <EditIcon />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  onClick={() => {
                    submitDelete();
                  }}
                >
                  <ClearIcon fontSize={"large"} color={"error"} />
                </Button>
              </Grid>
            </Grid>
          ) : null}
          <Grid item pl={2}>
            <h3>{publication.content}</h3>
          </Grid>
        </Grid>

        <Grid>
          <form
            style={{ display: `${displayEditPublication}` }}
            onSubmit={handleSubmit(submitUpdate)}
          >
            <Grid container direction={"row"} alignItems={"center"} pl={2}>
              <Grid item sm={4} style={{ width: "80%" }}>
                <TextField
                  fullWidth
                  label="modifier votre publication"
                  variant="outlined"
                  name="editContent"
                  defaultValue={publication.content}
                  id="outlined-multiline-static"
                  {...register("contentFoo", {
                    required: "Ce champ est obligatoire",
                  })}
                />
              </Grid>
              <Grid item style={{ width: "20%" }}>
                <Button type="submit" fontSize="large">
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </form>{" "}
          <Typography color={"error"} pl={2}>
            {errors.contentFoo?.message}
          </Typography>
        </Grid>

        {!publication.attachment ? null : (
          <Grid>
            <Image
              src={publication.attachment}
              alt="Picture of the author"
              width={1200}
              height={500}
            />
          </Grid>
        )}

        <IndexCommentary
          publication={publication}
          refreshPublications={refreshPublications}
        />
      </Grid>
    </div>
  );
}
