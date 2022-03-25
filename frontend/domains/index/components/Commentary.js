import styles from "../../../pages/index.module.scss";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { fetchApi } from "../../../api/fetchApi";
import { useForm } from "react-hook-form";
import { useProfil } from "../../../api/useProfil";

export const Commentary = ({
  commentary,
  publicationId,
  refreshCommentaries,
}) => {
  const { loading: loadingProfile, data: profile } = useProfil();
  const canEditOrDelete =
    !loadingProfile &&
    profile &&
    (profile.id === commentary.UserId || profile.isAdmin === true);
  console.log("canEditOrDelete", canEditOrDelete);

  const [showEditCommentaryForm, setShowEditCommentaryForm] = useState(false);
  const {
    register: registerUpdateComment,
    handleSubmit: handleSubmitUpdateComment,
    formState: { errorsUpdateComment },
  } = useForm();

  // const {
  //   handleSubmit: handleSubmitDeleteComment,
  //   formState: { errorsDeleteComment },
  // } = useForm();

  function submitUpdateCommentary(idCommentary) {
    return async (upComm) => {
      console.log("publicationId:", publicationId);
      await fetchApi(
        `publications/${publicationId}/comments/${idCommentary}`,
        "PUT",
        {
          commentary: upComm.contentFoo2,
        }
      )
        .then(() => setShowEditCommentaryForm(false))
        .then(() => refreshCommentaries())
        .catch((err) => {
          console.log(err);
        });
    };
  }

  async function submitDeleteCommentary(idCommentary) {
    return await fetchApi(
      `publications/${publicationId}/comments/${idCommentary}`,
      "DELETE"
    ).then(() => refreshCommentaries());
  }

  return (
    <Grid
      container
      direction={"row"}
      className={styles.totalWidth}
      alignItems={"center"}
      m={2}
    >
      <Grid item m={2}>
        <AccountCircleIcon fontSize="large" />
      </Grid>

      <Grid className={` ${styles.messageContainer}`}>
        <Grid item mb={2}>
          {" "}
          <strong>
            {commentary.User.firstName} {commentary.User.lastName}
          </strong>
        </Grid>

        {showEditCommentaryForm ? (
          <form
            onSubmit={handleSubmitUpdateComment(
              submitUpdateCommentary(commentary.id)
            )}
          >
            <Grid container alignItems={"center"} justifyContent={"center"}>
              <Grid item>
                <TextField
                  fullWidth
                  key={commentary.id}
                  label="modifier votre commentaire"
                  variant="outlined"
                  name={`editComm`}
                  defaultValue={commentary.commentary}
                  id="outlined-multiline-static"
                  {...registerUpdateComment(`contentFoo2`)}
                />
              </Grid>
              <Grid item sm={2}>
                <Button type="submit" fontSize="large">
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Grid item>{commentary.commentary}</Grid>
        )}
      </Grid>

      {canEditOrDelete ? (
        <Grid item className={styles.containerLogoMessage}>
          <Button
            type="submit"
            onClick={() => {
              setShowEditCommentaryForm((prevState) => !prevState);
            }}
          >
            <EditIcon />
          </Button>

          <Button
            type="submit"
            onClick={() => {
              submitDeleteCommentary(commentary.id);
            }}
          >
            <DeleteIcon fontSize={"large"} color={"error"} />
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
};
