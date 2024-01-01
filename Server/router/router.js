const express = require("express");
const router = express.Router();
const connectDb = require("../db/config");
const musicModel = require("../model/File");
const User = require("../model/User");
const mm = require("music-metadata");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

connectDb();

router.post("/uploadsong", upload.single("mp3file"), async (req, res) => {
  const { path, originalname, filename } = req.file;

  console.log(req.file);

  const metadata = await mm.parseFile(path);
  const { title, artist, picture, album } = metadata.common;

  res.json({
    title: originalname,
    artist: artist ? artist : "Unknown Artist",
    album: album ? album : "unknown album",
    picture: picture ? picture[0].data.toString("base64") : null,
  });

  const musicSchema = new musicModel({
    audioName: filename,
    audioFileName: originalname,
    audioPath: path,
  });

  await musicSchema.save();
});

router.get("/getItem", async (req, res) => {
  try {
    let api_ = await musicModel.find();
    res.json(api_);
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(403).json({ error: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid Credentials" });
    }

    return res.status(200).json({ message: "Successful Login" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(403).json({
      error: "A user with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserData = {
    fname,
    lname,
    email,
    password: hashedPassword,
  };
  const newUser = await User.create(newUserData);
  return res.send({ message: "Account has been created!! Please Login" });
});

module.exports = router;
