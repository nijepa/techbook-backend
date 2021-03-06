import mongoose from "mongoose";
import Joi from "joi";

const techSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* If post deleted remove all comments on post */
/* techSchema.pre("remove", function (next) {
  this.model("Comment").deleteMany({ comments: this._id }, next);
}); */

function validateTech(tech) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3),
    img_url: Joi.string().min(3),
    user: Joi.string().min(3),
  });

  return schema.validate(tech);
}

const Tech = mongoose.model("Tech", techSchema);

export { Tech, validateTech };
