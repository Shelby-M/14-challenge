const router = require("express").Router();
const { Comment, Post, User } = require("../models");
const sequelize = require("../config/connection");

router.get("/", (req, res) => {
  console.log(req.session);
  console.log("/ route");

  Post.findAll({
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username", "github"],
        },
      },
      {
        model: User,
        attributes: ["username", "github"],
      },
    ],
  })
    .then((dbPostData) => {
      res.render("homepage", { dbPostData });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/post/:id", (req, res) => {
  console.log("/post route");

  Post.findOne({
    where: { id: req.params.id },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["Username", "github"],
        },
      },
      {
        model: User,
        attributes: ["username", "github"],
      },
    ],
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "ERROR NO POST" });
        return;
      }
      const post = dbData.get({ plain: true });

      res.render("single-post", { post, loggedIn: req.session.loggedIn });
    })

    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  console.log("/login route");

  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  console.log("/signup route");

  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

module.exports = router;
