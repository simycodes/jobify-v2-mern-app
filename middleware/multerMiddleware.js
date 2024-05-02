import multer from "multer";

// Since data from the client is not send as json for when updating the user due to the 
// uploaded image, when the uploaded image and other data reachers this middleware, these
// files are changed into a json format and put in body.req so they easily handled in the controllers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
});
const upload = multer({ storage });

export default upload;
