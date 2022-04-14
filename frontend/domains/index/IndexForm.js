import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import styles from "../../pages/index.module.scss";
import { Alert, Collapse, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { fetchApi } from "../../api/fetchApi";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export function IndexForm({ refreshPublications }) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const submit = async (data) => {
    await fetchApi("/publications", "POST", {
      content: data.content,
      attachment: data.attachment,
    })
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  const [uploadImage, setUploadImage] = useState();

  const fetchUpload = (path, method, body) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      }),
      method,
      body: body,
    })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
  };

  const send = async () => {
    const data = new FormData();
    data.append("file", uploadImage);

    const response = await fetchUpload("upload", "POST", data);
    setValue("attachment", response.filename);
    setOpen(true);
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
                  label="Ecrivez votre message"
                  variant="outlined"
                  name="content"
                  multiline
                  id="outlined-multiline-static"
                  rows={6}
                  {...register("content", {
                    required: "Ce champ est obligatoire",
                  })}
                />
                <input type={"hidden"} name={"attachment"} />
              </Grid>
              <Typography color={"error"}>{errors.content?.message}</Typography>
              <Grid item sm={4} xs={6} mb={1} className={styles.totalWidth}>
                <input
                  type="file"
                  name="uploadFile"
                  accept="image/*"
                  onChange={(event) => {
                    const image = event.target.files[0];

                    setUploadImage(image);
                  }}
                />
                <br />
                <br />
                <button onClick={send}>Ajouter image</button>
                <Grid container mt={2} mb={2}>
                  <Collapse in={open}>
                    <Alert
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {"L'image à bien été ajouté"}
                    </Alert>
                  </Collapse>
                </Grid>
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
