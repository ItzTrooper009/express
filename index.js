console.clear();
const Joi = require("joi");
const express = require("express");
const logger = require("./logger");
const auth = require("./auth");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const app = express();

//pug
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
// app.use(auth);
// app.use(logger);

const customers = [
  {
    id: 1,
    name: "Robert",
  },
  {
    id: 2,
    name: "Downey",
  },
  {
    id: 3,
    name: "Junior",
  },
  {
    id: 4,
    name: "Chris",
  },
  {
    id: 5,
    name: "Evans",
  },
];

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/api/customer", (req, res) => {
  const len = customers.length;
  res.send(customers);
});

app.get("/api/customer/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer)
    return res.status(404).send("No customer found with given id.");
  res.send(customer);
});

app.post("/api/customer", (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  const result = Joi.validate(req.body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  const customer = {
    id: customers.length + 1,
    name: req.body.name,
  };
  customers.push(customer);
  res.send(customer);
});

app.put("/api/customer/:id", (req, res) => {
  if (!customers.find((c) => c.id === parseInt(req.params.id)))
    return res.status(400).send("Customer with given id not found");

  const schema = {
    name: Joi.string().min(3).required(),
  };

  const result = Joi.validate(req.body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const index = customers.findIndex((c) => c.id === parseInt(req.params.id));
  customers.splice(index, 1, {
    id: parseInt(req.params.id),
    name: req.body.name,
  });
  const customer = customers[index];
  res.send(customer);
});

app.delete("/api/customer/:id", (req, res) => {
  if (!customers.find((c) => c.id === parseInt(req.params.id)))
    return res.status(400).send("Customer with given id not found");
  const index = customers.findIndex((c) => c.id == req.params.id);
  const customer = customers[index];
  customers.splice(index, 1);
  res.send(customer);
});

process.env.PORT = 3000;
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
