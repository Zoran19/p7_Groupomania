export const fetchApi = (path, method = "GET", body) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
    headers: new Headers({
      Authorization: "Bearer " + localStorage.getItem("jwt_token"),
      "Content-Type": "application/json",
    }),
    method,
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Une erreur est arrivée ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.log("voici l'erreur: ", err);
    });
};
