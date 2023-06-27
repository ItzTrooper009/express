const express = require("express");
const router = express.Router();
const Joi = require("joi");

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

router.get("/", (req, res) => {
  const len = customers.length;
  res.send(customers);
});

router.get("/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer)
    return res.status(404).send("No customer found with given id.");
  res.send(customer);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  if (!customers.find((c) => c.id === parseInt(req.params.id)))
    return res.status(400).send("Customer with given id not found");
  const index = customers.findIndex((c) => c.id == req.params.id);
  const customer = customers[index];
  customers.splice(index, 1);
  res.send(customer);
});

module.exports = router;
