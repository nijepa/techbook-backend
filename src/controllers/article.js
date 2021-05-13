import { Article, validateArticle } from "../models/article.js";
import { Lang } from "../models/lang.js";

/* List of all articles */
const article_list = async (req, res) => {
  const articles = await req.context.models.Article.find()
    .populate("article")
    .populate("user", "username email picture isSocial createdAt name")
    .sort([["createdAt", -1]]);

  return res.send(articles);
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

const article_one = async (req, res) => {
  const article = await req.context.models.Article.findById(
    req.params.articleId
  );
  return res.send(article);
};

/* Create new article */
const article_add = async (req, res, next) => {
  const { error } = validateArticle(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const lang = await Lang.findById(req.body.langId);
  if (!lang) return res.status(400).send("Invalid lang.");

  const article = await req.context.models.Article.create({
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    img_url: req.body.img_url,
    user: req.body.user,
    links: req.body.links,
    lang: {
      _id: lang._id,
      title: lang.title,
      img_url: lang.img_url,
    },
  }).catch((error) => next(new Error(error)));

  const articleNew = await req.context.models.Article.findById(
    article._id
  ).populate("user", "username email picture isSocial createdAt name");

  return res.send(articleNew);
};

/* Update selected article */
const article_update = async (req, res, next) => {
  const { error } = validateArticle(req.body);
  if (error) return res.status(400).json({"error": error.details[0].message.toString()});

  const lang = await Lang.findById(req.body.langId);
  if (!lang) return res.status(400).json({"error": "Invalid lang."});

  const article = await req.context.models.Article.findOneAndUpdate(
    {
      _id: req.params.articleId,
    },
    {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      img_url: req.body.img_url,
      user: req.body.user,
      links: req.body.links,
      lang: {
        _id: lang._id,
        title: lang.title,
        img_url: lang.img_url,
      },
    }
  ).catch((error) => next(new Error(error)));

  const articleNew = await req.context.models.Article.findById(
    article._id
  ).populate("user", "username email picture isSocial createdAt name");

  return res.send(articleNew);
};

/* Delete selected article */
const article_delete = async (req, res) => {
  const article = await req.context.models.Article.findById(
    req.params.articleId
  );

  if (tech) {
    await article.remove();
  }
  return res.send(article);
};

export {
  article_list,
  post_user_list,
  article_one,
  article_add,
  article_update,
  article_delete,
};
