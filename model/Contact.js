const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema(
  {
    countryCode: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      index: false,
      unique: false,
      require: true,
    },
    contactPicture: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

//creating a custom method to verify user
ContactSchema.methods.isOwner = async function (owner) {
  if (owner === this.owner) {
    return true;
  } else {
    return false;
  }
};
module.exports = mongoose.model("contact", ContactSchema);
