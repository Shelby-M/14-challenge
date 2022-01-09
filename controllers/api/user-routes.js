const router = require("express").Router();
const withAuth = require("../../utils/auth");

const { Post, User, Comment } = require("../../models");

router.get("/", (req, res) => {
  User.findAll({ attributes: { exclude: ["password"] } })
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
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

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.github,
  }).then((dbData) => {
    req.session.save(() => {
      req.session.user_id = dbData.id;
      req.session.username = dbData.username;
      req.session.github = dbData.github;
      req.session.loggedIn = true;

      res.json(dbData);
    });
  });
});

router.put("/:id", withAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id },
  })
    .then((dbData) => {
      if (!dbData[0]) {
        res.status(404).json({ message: "ERROR NO USER FOUND" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  User.destroy({
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

router.post("/login", (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  }).then((dbdata) => {
    if (!dbdata) {
      res.status(404).json({ message: "ERROR NO POST FOUND" });
      return;
    }
    const validPassword = dbData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Wrong Password!" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbData.id;
      req.session.username = dbData.username;
      req.session.github = dbData.github;
      req.session.loggedIn = true;

      res.json({ user: dbData, message: "You are now logged-in!!!!" });
    });
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
