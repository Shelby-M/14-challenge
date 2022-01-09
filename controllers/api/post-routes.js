const router = require("express").Router();
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

const { Post, User, Comment } = require("../../models");

router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "post_url", "created_at", "title"],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "Error No Post Found" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_content: req.body.post_content,
    user_id: req.session.user_id,
  })
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_content: req.body.post_content,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "Error NO Post Found" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: { id: req.params.id },
  })
    .then((dbdata) => {
      if (!dbdata) {
        res.status(404).json({ message: "ERROR NO POST FOUND" });
        return;
      }
      res.json(dbdata);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
