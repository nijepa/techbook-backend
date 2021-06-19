import { Lang, validateLang } from "../models/lang.js";

/* List of all langs */
const lang_list = async (req, res) => {
  const langs = await req.context.models.Lang.find()
    .populate("lang")
    .populate("user", "username email picture isSocial createdAt name")
    .populate("tech", "title description createdAt")
    .sort([["createdAt", -1]]);

  return res.send(langs);
};

const lang_one = async (req, res) => {
  const lang = await req.context.models.Lang.findById(req.params.langId);
  return res.send(lang);
};

/* Create new lang */
const lang_add = async (req, res, next) => {
  const { error } = validateLang(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const lang = await req.context.models.Lang.create({
    title: req.body.title,
    description: req.body.description,
    img_url: req.body.img_url,
    user: req.body.user,
    groups: req.body.groups,
    tech: req.body.tech,
  }).catch((error) => next(new Error(error.message)));

  const langNew = await req.context.models.Lang.findById(lang._id)
    .populate("user", "username email picture isSocial createdAt name")
    .populate("tech", "title description createdAt");

  return res.send(langNew);
};

/* Update selected lang */
const lang_update = async (req, res, next) => {
  const { error } = validateLang(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const lang = await req.context.models.Lang.findOneAndUpdate(
    {
      _id: req.params.langId,
    },
    {
      title: req.body.title,
      description: req.body.description,
      img_url: req.body.img_url,
      user: req.body.user,
      groups: req.body.groups,
      tech: req.body.tech,
    }
  ).catch((error) => next(new Error(error.message)));

  const langNew = await req.context.models.Lang.findById(lang._id)
    .populate("user", "username email picture isSocial createdAt name")
    .populate("tech", "title description createdAt");

  return res.send(langNew);
};

/* Delete selected lang */
const lang_delete = async (req, res) => {
  const lang = await req.context.models.Lang.findById(req.params.langId);

  if (tech) {
    await lang.remove();
  }
  return res.send(lang);
};

export { lang_list, lang_one, lang_add, lang_update, lang_delete };
