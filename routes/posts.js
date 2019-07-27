const express = require('express');
const router = express.Router();

const db = require('../data/db');

router.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    if (posts) res.status(200).json({ success: true, posts });
    else res.status(404).json({ success: false, message: "Posts do not exist." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Posts could not be retrieved." });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await db.findById(req.params.id);
    if (post) res.status(200).json({ success: true, post });
    else res.status(404).json({ success: false, message: "Post does not exist." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Post could not be retrieved." });
  }
});

module.exports = router;