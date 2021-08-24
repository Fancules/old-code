import multer from 'multer';

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/gi, '-') + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if(mimeTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

export default multer({storage, fileFilter});