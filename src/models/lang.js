import mongoose from "mongoose";
import Joi from "joi";

const langSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    description: {
      type: String,
      required: false,
    },
    img_url: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 550,
    },
    links: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tech: { type: mongoose.Schema.Types.ObjectId, ref: "Tech" },
  },
  { timestamps: true }
);

/* If post deleted remove all comments on post */
/* techSchema.pre("remove", function (next) {
  this.model("Comment").deleteMany({ comments: this._id }, next);
}); */

function validateLang(lang) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3),
    img_url: Joi.string().min(3),
    links: Joi.array().items(Joi.string()),
    user: Joi.string().min(3),
    tech: Joi.string().min(3),
  });

  return schema.validate(lang);
}

const Lang = mongoose.model("Lang", langSchema);

export { Lang, validateLang };
