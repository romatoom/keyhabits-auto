import express from "express";
import home from "#app/routes/home.js";
import api from "#app/routes/api.js";

import { HOST, PORT } from "#app/constants.js";

const app = express();

app.use(express.static("public", { index: false }));

app.use(home);
app.use("/api", api);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Open ${HOST}`);
});
