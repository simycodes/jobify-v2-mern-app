import multer from "multer";
import DataParser from "datauri/parser.js"; // js extension needed, else errors
import path from "path";

// Since data from the client is not send as json for when updating the user due to the
// uploaded image, when the uploaded image and other data reachers this middleware, these
// files are changed into a json format and put in body.req so they easily handled in the controllers
const storage = multer.memoryStorage();
const upload = multer({ storage });

const parser = new DataParser();

// Convert file from butter format to a usable format that can be uploaded on cloudinary
export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
