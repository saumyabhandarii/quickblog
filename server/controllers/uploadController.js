import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
const result = await imagekit.upload({
  file: imageBuffer, // or base64/file stream
  fileName: "blog_pic_1.png",
  folder: "blogs",
});


export default imagekit;
