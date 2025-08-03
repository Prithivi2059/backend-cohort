const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

async function createImageToDb(file, fileName) {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: "cohort-images",
    });
    return response;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    throw new Error("Failed to upload image");
  }
}

module.exports = createImageToDb;
