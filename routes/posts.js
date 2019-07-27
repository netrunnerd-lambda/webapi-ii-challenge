const express = require('express');
const router = express.Router();

const db = require('../data/db');

router.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    if (posts.length > 0) res.status(200).json({ success: true, posts });
    else res.status(404).json({ success: false, message: "Posts do not exist." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Posts could not be retrieved." });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (post.length > 0) res.status(200).json({ success: true, post });
    else res.status(404).json({ success: false, message: "Post does not exist." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Post could not be retrieved." });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await db.findPostComments(req.params.id);
    if (comments.length > 0) res.status(200).json({ success: true, comments });
    else res.status(404).json({ success: false, message: "Post does not exist." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Post comments could not be retrieved." });
  }
});

router.post('/', async (req, res) => {
  const freshPost = req.body;
  const { title, contents } = freshPost;

  if (!title || !contents)
    res.status(400).json({ success: false, message: "Please provide `title` and `contents` for post."}); 

  try {
    const posted = await db.insert(freshPost);

    if (posted) {
      const post = await db.findById(posted.id);
      res.status(201).json({ success: true, post });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Post could not be saved." });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const post = await db.findById(id);

  if (post.length === 0)
    res.status(404).json({ success: false, message: "Post does not exist." });

  if (!text)
    res.status(400).json({ success: false, message: "Please provide `text` for comment." });

  try {
    const freshComment = { "post_id": id, text };
    
    const posted = await db.insertComment(freshComment);

    if (posted) {
      const comment = await db.findCommentById(posted.id);
      res.status(201).json({ success: true, comment });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Comment could not be saved." });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const originalPost = await db.findById(id);
  const updatedPost = req.body;
  const { title, contents } = updatedPost;

  if (originalPost.length === 0)
    res.status(404).json({ success: false, message: "Post does not exist." });
  
  if (!title || !contents)
    res.status(400).json({ success: false, message: "Please provide `title` and `contents` for post." });
  
  try {
    const updated = await db.update(id, updatedPost);

    if (updated) {
      const post = await db.findById(id);
      res.status(200).json({ success: true, post });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Post could not be modified." });
  }
});

module.exports = router;