import Post from '../models/post.js';

/* List of all posts */
const post_list = async (req, res) => {
  const posts = await req.context.models.Post.find()
    .populate('post')
    .populate({path: 'comments', select: 'text createdAt likes', populate: 'author'})
    .populate('user')
    .sort([['createdAt', -1]])
  return res.send(posts);
};

/* List of user posts */
const post_user_list = async (req, res) => {
  const posts = await req.context.models.Post.find({ user: req.params.userId })
    .populate('post')
    .populate({path: 'comments', select: 'text createdAt likes', populate: 'author'})
    .populate('user')
  return res.send(posts);
};

const post_one = async (req, res) => {
  const post = await req.context.models.Post.findById(
    req.params.postId,
  );
  return res.send(post);
};

/* Create new post */
const post_add = async (req, res, next) => {
  const post = await req.context.models.Post.create({
    title: req.body.title,
    text: req.body.text,
    user: req.body.user,
  }).catch((error) => next(new BadRequestError(error)));

  const postNew = await req.context.models.Post.findById(
    post._id,
  )
  .populate('user');
  return res.send(postNew);
};

/* Create new comment for selected post */
const post_comment = async (req, res, next) => {
  const comment = await req.context.models.Comment.create({
    text: req.body.text,
    author: req.body.user,
  }).catch((error) => next(new BadRequestError(error)));

  const newCommentId = await req.context.models.Comment.findOne().sort({ createdAt: -1 }).limit(1);

  const post = await req.context.models.Post.updateOne({ 
    _id: req.body.id }, 
    { $push: { 'comments': newCommentId }
  }).catch((error) => next(new BadRequestError(error)));

  const upPost = await req.context.models.Post.findById(
    req.body.id,
  )
  .populate({path: 'comments', select: 'text createdAt likes', populate: 'author'});

  return res.send(upPost);
};

/* Delete comment */
const post_comment_delete = async (req, res, next) => {
  const post = await req.context.models.Post.findOneAndUpdate({ 
    _id: req.body[1].postId }, 
    { $pull: { 'comments': req.params.commentId } },
    { "new": true }
  ).catch((error) => next(new BadRequestError(error)));
  const comment = await req.context.models.Comment.findById(
    req.params.commentId,
  );
  if (comment) {
    await comment.remove();
  }

  return res.send({commentId:comment._id, postId: post._id});
};

/* Post Like */
const post_like = async (req, res, next) => {
  const upPost = await req.context.models.Post.findOne({
    _id: req.params.postId, likes: {$in: req.body.user}}
  ).populate('comments');

  if (upPost) {
    const post = await req.context.models.Post.findOneAndUpdate({ 
      _id: req.params.postId }, 
      { $pull: { 'likes': req.body.user } },
      { "new": true }
    ).catch((error) => next(new BadRequestError(error)));
    return res.send(post);
  } else {
    const post = await req.context.models.Post.findOneAndUpdate({ 
      _id: req.params.postId, likes: {$ne: req.body.user}}, 
      { $push: { 'likes': req.body.user } },
      { "new": true }
    ).catch((error) => next(new BadRequestError(error)));
    return res.send(post);
  }
};

/* Comment Like */
const comment_like = async (req, res, next) => {
  const upComment = await req.context.models.Comment.findOne({
    _id: req.params.commentId, likes: {$in: req.body.user}}
  );

  if (upComment) {
    const comment = await req.context.models.Comment.findOneAndUpdate({ 
      _id: req.params.commentId }, 
      { $pull: { 'likes': req.body.user } },
      { "new": true }
    ).catch((error) => next(new BadRequestError(error)));
    return res.send(comment);
  } else {
    const comment = await req.context.models.Comment.findOneAndUpdate({ 
      _id: req.params.commentId, likes: {$ne: req.body.user}}, 
      { $push: { 'likes': req.body.user } },
      { "new": true }
    ).catch((error) => next(new BadRequestError(error)));
    return res.send(comment);
  }
};

/* Dislike */
const post_dislike = async (req, res, next) => {
  const post = await req.context.models.Post.findOneAndUpdate({ 
    _id: req.params.postId }, 
    { $pull: { 'likes': req.body.user } }
  ).catch((error) => next(new BadRequestError(error)));
  
  return res.send(post);
};

/* Update selected post */
const post_update = async (req, res, next) => {
  const post = await req.context.models.Post.findOneAndUpdate({ 
    _id: req.params.postId }, 
    { title: req.body.title, 
      text: req.body.text, 
      user: req.body.user }
  ).catch((error) => next(new BadRequestError(error)));
  
  const postNew = await req.context.models.Post.findById(
    post._id,
  ).populate('user')
  .populate({path: 'comments', select: 'text createdAt likes', populate: 'author'});

  return res.send(postNew);
};

/* Delete selected post */
const post_delete = async (req, res) => {
  const post = await req.context.models.Post.findById(
    req.params.postId,
  );

  if (post) {
    await post.remove();
  }
  return res.send(post);
};

export { 
        post_list, 
        post_user_list,
        post_one, 
        post_add, 
        post_comment, 
        post_comment_delete,
        post_update, 
        post_delete,
        post_like,
        post_dislike,
        comment_like
};