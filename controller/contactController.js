const Contact = require("../model/Contact");
const createError = require("http-errors");
const {
  contactSchema,
  updateContactSchema,
} = require("../helper/validationSchema");

module.exports = {
  getContact: async (req, res, next) => {
    try {
      const contact = await Contact.find({ owner: req.payload.aud });
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  },
  createContact: async (req, res, next) => {
    try {
      req.body.owner = req.payload.aud;
      const result = await contactSchema.validateAsync(req.body);
      const doesExist = await Contact.findOne({
        phoneNumber: result.phoneNumber,
        owner: req.payload.aud,
      });

      if (doesExist) throw createError.Conflict("Contact already exists");

      const contact = new Contact(result);
      const saveContact = await contact.save();
      res.status(201).json(saveContact);
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  },
  getSingleContact: async (req, res, next) => {
    try {
      const id = req.params.id;
      const contact = await Contact.findOne({
        _id: id,
        owner: req.payload.aud,
      });
      if (!contact) throw createError.NotFound("contact doesn't exist");
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  },
  updateContact: async (req, res, next) => {
    try {
      const id = req.params.id;
      const contact = await Contact.findById(id);
      if (!contact) throw createError.NotFound("Contact doesn't exist");
      const isOwner = await contact.isOwner(req.payload.aud);
      if (!isOwner)
        throw createError.Unauthorized("you are not allowed to update contact");

      const result = await updateContactSchema.validateAsync(req.body);
      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { $set: result },
        { new: true }
      );
      res.status(200).json(updatedContact);
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  },
  deleteContact: async (req, res, next) => {
    try {
      const id = req.params.id;
      const contact = await Contact.findById(id);
      if (!contact) throw createError.NotFound("Contact doesn't exist");
      const isOwner = await contact.isOwner(req.payload.aud);
      if (!isOwner)
        throw createError.Unauthorized("you are not allowed to delete contact");
      await Contact.findByIdAndDelete(id);
      res.status(200).json({ status: "contact deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
