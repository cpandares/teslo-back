import { v4 } from "uuid";

export const fileNamed = (req: Express.Request, file: Express.Multer.File, cb: Function) => {

    if(!file) return cb(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${v4()}.${fileExtension}`;


    return cb(null, fileName);


}