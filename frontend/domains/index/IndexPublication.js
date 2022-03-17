import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import React from "react";
import styles from "../../pages/index.module.scss";
import { Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { fetchApi } from "../../api/fetchApi";
import { useForm } from "react-hook-form";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

export function IndexPublication({ publication, refreshPublications }) {
  const [displayCommentary, setDisplayCommentary] = useState("none");
  const [displayEditPublication, setDisplayEditPublication] = useState("none");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitDelete = async (data) => {
    await fetchApi(`publications/${publication.id}`, "DELETE").then(() =>
      refreshPublications()
    );
  };

  const submitUpdate = async (data) => {
    await fetchApi(`publications/${publication.id}`, "PUT", {
      content: data.content,
    })
      .then(() => setDisplayEditPublication("none"))
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  const like = async (data) => {
    await fetchApi(`publications/${publication.id}/vote/like`, "POST")
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };
  const dislike = async (data) => {
    await fetchApi(`publications/${publication.id}/vote/dislike`, "POST")
      .then(() => refreshPublications())
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.containerForm}>
      <Grid>
        <Grid
          container
          direction={"row"}
          justifyContent={"space-between"}
          style={{
            paddingBottom: "10px",
            marginBottom: "10px",
            paddingLeft: "20px",
          }}
        >
          <Grid item>
            <h3>{publication.content}</h3>
            <form
              style={{ display: `${displayEditPublication}` }}
              onSubmit={handleSubmit(submitUpdate)}
            >
              <Grid container alignItems={"center"}>
                <Grid item sm={10}>
                  <TextField
                    fullWidth
                    label="modifier votre publication"
                    variant="outlined"
                    name="content"
                    defaultValue={publication.content}
                    id="outlined-multiline-static"
                    {...register("content")}
                  />
                </Grid>
                <Grid item sm={2}>
                  <Button type="submit" fontSize="large">
                    <SendIcon />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

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

        <Grid
          container
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
          style={{
            borderBottom: "1px solid black",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <Grid item pl={2} pt={2}>
            {" "}
            {publication.likes} &#128525; &#10084;&#65039;
          </Grid>
          <Grid item pr={2} pt={2}>
            2 commentaires
          </Grid>
        </Grid>

        <Grid
          container
          direction={"row"}
          alignItems={"center"}
          className={styles.totalWidth}
        >
          <Grid item m={2}>
            <AccountCircleIcon fontSize="large" />
          </Grid>

          <Grid
            item
            style={{
              backgroundColor: "#ededed",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Grid item mb={2}>
              {" "}
              <strong>Vincent Mentor</strong>
            </Grid>
            <Grid item>Très bon travail Zoran</Grid>
          </Grid>

          <Grid item m={1}>
            <Button type="submit">
              <EditIcon />
            </Button>
            <Button type="submit">
              <DeleteIcon fontSize={"large"} color={"error"} />
            </Button>
          </Grid>
        </Grid>

        <form
          className={styles.totalWidth}
          style={{
            borderTop: "1px solid black",
            marginTop: "20px",
          }}
        >
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            pt={3}
            pl={2}
            style={{ display: `${displayCommentary}` }}
          >
            <Grid item sm={10}>
              <TextField
                fullWidth
                label="Ecriver votre message"
                name="publication"
                multiline
                id="filled-multiline-static"
                variant="filled"
                rows={2}
              />
            </Grid>

            <Grid item sm={2}>
              <Button type="submit" fontSize="large">
                <SendIcon />
              </Button>
            </Grid>
          </Grid>
        </form>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Grid item pl={2} pt={2}>
            <Button
              variant="text"
              onClick={() => {
                like();
              }}
            >
              <ThumbUpIcon />
              <Typography style={{ marginLeft: "5px" }}>J'aime</Typography>
            </Button>
            <Button
              variant="text"
              onClick={() => {
                dislike();
              }}
            >
              <ThumbDownIcon color={"error"} />
              <Typography style={{ marginLeft: "5px" }} color={"error"}>
                J'aime pas
              </Typography>
            </Button>
          </Grid>
          <Grid item pr={2} pt={2}>
            <Button
              variant="text"
              onClick={() => {
                if (displayCommentary === "none") {
                  setDisplayCommentary("flex");
                } else setDisplayCommentary("none");
              }}
            >
              <ChatBubbleIcon />
              <Typography style={{ marginLeft: "5px" }}>Commenter</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
