const express = require("express");
const {
  getContact,
  createContact,
  getSingleContact,
  updateContact,
  deleteContact,
} = require("../controller/contactController");
const route = express.Router();

//get all contact list
route.get("/", getContact);

//create contact
route.post("/", createContact);

//get single contact
route.get("/:id", getSingleContact);

//update contacts
route.put("/:id", updateContact);

//delte contact

route.delete("/:id", deleteContact);

module.exports = route;
