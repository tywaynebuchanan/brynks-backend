const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const Transactions = require("./routes/transfers");
const Requests = require("./routes/requests");
const cookieParser = require("cookie-parser");
const morgan = require("morgan")
const errorMiddleware = require("./middlewares/errors")
const DB = require("./config/dbconfig")
require("dotenv").config()

const PORT = process.env.PORT || 4000
const MODE = process.env.NODE_ENV

const app = express();

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server Started Successfully on ${PORT} in ${MODE}`);
  }
});

DB.on("error", err => {
	console.log(err)
})

DB.once("open", () => {
	console.log("DB connected success")
})

app.use(morgan("tiny"))
// app.use(
//   cors({
//     origin: "https://64a31e7ea3ef6d47ec7df1d9--quiet-mermaid-f1173b.netlify.app/",
//     // methods: ["GET", "POST"],
//     // credentials: true,
//   })
// );

app.use(cors());

app.use(cookieParser());

app.use(express.json());

// app.use("/",(res,req)=>{
//   res.send("API Working");
// })
app.use("/api", authRoutes);
app.use("/api/transactions", Transactions);
app.use("/api/requests", Requests);

app.use(errorMiddleware)




