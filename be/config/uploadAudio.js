
import  multer from 'koa-multer'

const storage = multer.diskStorage({
    destination:'audios',
    filename(ctx, file, cb) {
        const fileName = Date.now()+'_'+parseInt(Math.random()*10000,0)+'.'+file.originalname.split(".")[file.originalname.split(".").length-1];
        cb(null,fileName);
    }
});

const multerConfig = multer({storage});

export default multerConfig;