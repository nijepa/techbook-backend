import mongoose from "mongoose";
import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 150,
    },
    description: {
      type: String,
      maxlength: 1550,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    img_url: {
      type: String,
      required: false,
      minlength: 0,
      maxlength: 550,
    },
    links: [String],
    lang: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        img_url: {
          type: String,
          required: false,
          min: 0,
          max: 555,
        },
      }),
      required: true,
    },
    groups: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* If post deleted remove all comments on post */
/* techSchema.pre("remove", function (next) {
  this.model("Comment").deleteMany({ comments: this._id }, next);
}); */

function validateArticle(article) {
  const schema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().min(1).required(),
    description: Joi.string().min(3),
    code: Joi.string().min(3),
    img_url: Joi.string().allow(null, ''),
    user: Joi.string().min(3),
    links: Joi.array().items(Joi.string()),
    lang: Joi.object(),
    langId: myJoiObjectId().required(),
    groups: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    __v: Joi.number()
  });

  return schema.validate(article);
}

const Article = mongoose.model("Article", articleSchema);

export { Article, validateArticle };
