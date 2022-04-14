import Grid from "@mui/material/Grid";
import styles from "../../pages/index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Typography } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCommentaries } from "../../api/useCommentaries";
import { fetchApi } from "../../api/fetchApi";
import { usePublications } from "../../api/usePublications";
import { Commentary } from "./components/Commentary";

export function IndexCommentary({ publication }) {
  const [showCreateCommentaryForm, setShowCreateCommentaryForm] = useState(
    false
  );

  const {
    register: registerCreateComment,
    handleSubmit: handleSubmitCreateComment,
    formState: { errors },
  } = useForm();

  const {
    loading: loadingCommentaries,
    data: commentaries,
    mutate: refreshCommentaries,
  } = useCommentaries(publication.id);

  const { mutate: refreshLikes } = usePublications();

  const like = async () => {
    await fetchApi(`publications/${publication.id}/vote/like`, "POST")
      .then(() => refreshLikes())
      .catch((err) => {
        console.log(err);
      });
  };
  const dislike = async () => {
    await fetchApi(`publications/${publication.id}/vote/dislike`, "POST")
      .then(() => refreshLikes())
      .catch((err) => {
        console.log(err);
      });
  };

  const submitCreateCommentary = async (comm) => {
    await fetchApi(`publications/${publication.id}/comments`, "POST", {
      commentary: comm.comment,
    })
      .then(() => setShowCreateCommentaryForm(false))
      .catch((err) => {
        console.log(err);
      })
      .then(() => refreshCommentaries())
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        className={styles.publicationMessageContainer}
      >
        <Grid item pl={2} pt={2}>
          {" "}
          {publication.likes} &#128525; &#10084;&#65039;
        </Grid>
        {loadingCommentaries ? null : (
          <Grid item pr={2} pt={2}>
            {commentaries.length} commentaires
          </Grid>
        )}
      </Grid>

      {loadingCommentaries
        ? null
        : commentaries.map((commentary) => (
            <Commentary
              refreshCommentaries={refreshCommentaries}
              commentary={commentary}
              publicationId={publication.id}
              key={commentary.id}
            />
          ))}

      <Grid container mt={1} className={styles.containerButtonLikeAndComm}>
        <Grid item pl={2} pt={2}>
          <Button
            variant="text"
            onClick={() => {
              like();
            }}
          >
            <ThumbUpIcon />
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Typography className={styles.likePubli}>J'aime</Typography>
          </Button>
          <Button
            variant="text"
            onClick={() => {
              dislike();
            }}
          >
            <ThumbDownIcon color={"error"} />
            <Typography color={"error"} className={styles.likePubli}>
              {"J'aime pas"}
            </Typography>
          </Button>
        </Grid>

        <Grid item pl={2} pt={2}>
          <Button
            variant="text"
            onClick={() => {
              setShowCreateCommentaryForm((prevState) => !prevState);
            }}
          >
            <ChatBubbleIcon />
            <Typography className={styles.likePubli}>Commenter</Typography>
          </Button>
        </Grid>
      </Grid>
      {showCreateCommentaryForm && (
        <form onSubmit={handleSubmitCreateComment(submitCreateCommentary)}>
          <Grid container alignItems={"center"} pt={2} pl={2}>
            <Grid item sm={10}>
              <TextField
                autoFocus
                id="commentaryCreate"
                fullWidth
                label="Créer votre commentaire"
                variant="outlined"
                name="comment"
                {...registerCreateComment("comment", {
                  required: "Ce champ est obligatoire",
                })}
              />
            </Grid>
            <Grid item sm={2}>
              <Button type="submit" fontSize="large">
                <SendIcon />
              </Button>
            </Grid>
            <Typography color={"error"}>{errors.comment?.message}</Typography>
          </Grid>
        </form>
      )}
    </div>
  );
}
