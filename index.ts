import { NextFunction, Request, Response } from 'express'
import express from 'express'
import multer, { MulterError } from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync(path.join(process.cwd(), 'uploads'));
        } catch(err) {}
        
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: storage });
const maxFileCount = 2;

app.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest file: ${JSON.stringify(req?.file, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
});

app.post('/upload-multiple', upload.array('files', maxFileCount), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
}, (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Too many files!');   
    }
});

app.post('/upload-multiple-with-specified-fields', upload.fields([
    { name: 'a-type-files', maxCount: 2 }, 
    { name: 'b-type-files', maxCount: 3 }
]), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
}, (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Too many files!');   
    }
});

app.post('/upload-multiple-with-fields', upload.any(), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
});

app.listen(3000);