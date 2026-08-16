const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_KEY,
});

async function uploadFile(buffer, originalName = "upload.jpg") {
  const result = await imagekit.files.upload({
    file: await toFile(buffer, originalName),
    fileName: originalName,
  });
  return result;
}

module.exports = uploadFile;
