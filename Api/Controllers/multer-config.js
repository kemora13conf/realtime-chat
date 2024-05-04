import multer from "multer";
// Create a storage object
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
export default upload;
