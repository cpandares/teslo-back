import { Request } from 'express';



export const fileValidator = ( req: Request, file: Express.Multer.File, cb: Function )=>{

    // Check if the file is an image
    if(!file) return cb(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
    const isValidExtension = allowedExtensions.includes(fileExtension);

    
    if(isValidExtension) {
        return cb(null, true);
    }


    cb(null, false);

}