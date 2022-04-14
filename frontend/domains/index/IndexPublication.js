import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React from "react";
import styles from "../../pages/index.module.scss";
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

  const [displayEditPublication, setDisplayEditPublication] = useState(false);
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
    await fetchApi(`publications/${publication.id}`, "PUT", {
      content: data2.contentFoo,
    })
      .then(() => setDisplayEditPublication(false))
      .catch((err) => {
        console.log(err);
      })
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  const datePublication = publication.createdAt.split("T");
  const split_string = datePublication[0].split("-");
  const date = split_string.reverse().join("/");

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
                    setDisplayEditPublication((prevState) => !prevState);
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
            <Typography className={styles.datePubli}>le: {date}</Typography>
          </Grid>

          <Grid item pl={2}>
            <h3>{publication.content}</h3>
          </Grid>
        </Grid>
        {displayEditPublication && (
          <Grid>
            <form onSubmit={handleSubmit(submitUpdate)}>
              <Grid
                container
                direction={"row"}
                alignItems={"center"}
                pl={2}
                mb={2}
              >
                <Grid item sm={4} className={styles.widthModifPubli}>
                  <TextField
                    autoFocus
                    id="modifPubli"
                    fullWidth
                    label="modifier votre publication"
                    variant="outlined"
                    name="editContent"
                    defaultValue={publication.content}
                    {...register("contentFoo", {
                      required: "Ce champ est obligatoire",
                    })}
                  />
                </Grid>
                <Grid item className={styles.buttonSendModifPubli}>
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
        )}

        {!publication.attachment ? null : (
          <Grid container justifyContent={"center"} alignItems={"center"}>
            <img
              src={`http://localhost:8080/uploads/${publication.attachment}`}
              alt="Picture of the author"
              className={styles.imagePubli}
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
