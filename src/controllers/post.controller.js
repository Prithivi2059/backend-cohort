const { createImagetoCaption } = require("../services/ai.service");
const createImageToDb = require("../services/imagekitStorage.service");
const { v4: uuidv4 } = require("uuid");
const postModel = require("../models/post.model");

const createPostController = async (req, res) => {
  const file = req.file;

  const base64ImageData = new Buffer.from(file.buffer).toString("base64");
  try {
    const caption = await createImagetoCaption(base64ImageData);
    const imageUrl = await createImageToDb(file.buffer, uuidv4());

    const post = await postModel.create({
      caption: caption,
      image: imageUrl.url,
      user: req.user._id,
    });
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate caption" });
  }
};

module.exports = createPostController;
