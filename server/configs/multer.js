

// Setup basic để server có thể nhận file từ frontend
import multer from 'multer';

const storage = multer.diskStorage({}); // Lưu file vào ổ cứng server, {}: default config

const upload = multer({ storage })

export default upload;