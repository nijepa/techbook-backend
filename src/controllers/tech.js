import { Tech, validateTech } from "../models/tech.js";

/* List of all techs */
const tech_list = async (req, res, next) => {
  const techs = await req.context.models.Tech.find()
    .populate("tech")
    .populate("user", "username email picture isSocial createdAt name")
    .sort([["createdAt", -1]]);

  return res.send(techs);
};

/* List of user posts */
const post_user_list = async (req, res) => {
  const posts = await req.context.models.Post.find({ user: req.params.userId })
    .populate("post")
    .populate({
      path: "comments",
      select: "text createdAt likes",
      populate: {
        path: "author",
        select: "username email picture isSocial createdAt name",
      },
    })
    .populate("user", "username email picture isSocial createdAt name");
  return res.send(posts);
};

/* One tech */
const tech_one = async (req, res) => {
  const tech = await req.context.models.Tech.findById(req.params.techId);
  return res.send(tech);
};

/* Create new tech */
const tech_add = async (req, res, next) => {
  const { error } = validateTech(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tech = await req.context.models.Tech.create({
    title: req.body.title,
    description: req.body.description,
    img_url: req.body.img_url,
    user: req.body.user,
  }).catch((error) => next(new Error(error.message)));

  const techNew = await req.context.models.Tech.findById(tech._id).populate(
    "user",
    "username email picture isSocial createdAt name"
  );

  return res.send(techNew);
};

/* Update selected tech */
const tech_update = async (req, res, next) => {
  const { error } = validateTech(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tech = await req.context.models.Tech.findOneAndUpdate(
    {
      _id: req.params.techId,
    },
    {
      title: req.body.title,
      description: req.body.description,
      img_url: req.body.img_url,
      user: req.body.user,
    }
  ).catch((error) => next(new Error(error.message)));

  const techNew = await req.context.models.Tech.findById(tech._id).populate(
    "user",
    "username email picture isSocial createdAt name"
  );

  return res.send(techNew);
};

/* Delete selected tech */
const tech_delete = async (req, res) => {
  const tech = await req.context.models.Tech.findById(req.params.techId);

  if (tech) {
    await tech.remove();
  }
  return res.send(tech);
};

export {
  tech_list,
  post_user_list,
  tech_one,
  tech_add,
  tech_update,
  tech_delete,
};
