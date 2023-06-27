console.clear();
const express = require("express");
const logger = require("./middleware/logger");
const auth = require("./auth");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const customers = require("./routes/customers");
const home = require("./routes/home");

const app = express();

//pug sued to send a html page
// app.set("view engine", pug);
// app.set("views", "./views");

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan Runnig...");
}

console.log("Configuration Name :", config.get("name"));
if (app.get("env") === "development" || app.get("env") === "production") {
  console.log("Mail Server :", config.get("mail.host"));
  console.log("Mail Password :", config.get("mail.password"));
}

//Debuggers
dbDebugger("Demo DB Debugger");
startupDebugger("Demo Startup Debugger");

// console.log(process.env.NODE_ENV);
console.log("NODE_ENV : ", app.get("env"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/customers", customers);
app.use("/", home);
// app.use(auth);
// app.use(logger);

process.env.PORT = 3000;
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
