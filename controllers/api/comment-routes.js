const router = require("express").Router();
const withAuth = require("../../utils/auth");

const { Comment } = require("../../models");
const { Router } = require("express");

router.get("/", (req, res) => {
  Comment.findAll({})
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
      .then((dbData) => res.json(dbData))
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

router.delete("/:id", withAuth, (req, res) => {
  Comment.destroy({
    where: { id: req.params.id },
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "Error" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
