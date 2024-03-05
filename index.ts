import { NextFunction, Request, Response } from 'express'
import express from 'express'
import multer from 'multer'
import cors from 'cors'

const app = express()
app.use(cors())

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest file: ${JSON.stringify(req?.file, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
});

app.listen(3000);