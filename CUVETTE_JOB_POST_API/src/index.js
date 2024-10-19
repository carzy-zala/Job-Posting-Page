import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/db.js";
import {app} from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR :: APP CAN'T ACCESS DATABASE", error);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `Server is runnuning on : http://localhost:${process.env.PORT}/`
      );
    });
  })
  .catch((error) => {
    console.log("ERROR :: CONNECTION ERROR", error);
  });
