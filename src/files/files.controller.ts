import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidator } from './helpers/fileValidator';
import { diskStorage } from 'multer';
import { fileNamed } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor( 
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,

  ) {}


  @Get('product/:imageName')
  
  findOneProduct(
    @Res() res: Response,
    @Param('imageName') imageName: string) {
    const path = this.filesService.getProductImage(imageName);

    res.status(200).sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileValidator,
    storage: diskStorage({
      destination: './uploads/products',
      filename: fileNamed
    })
  }))
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {

    
    if(!file){
      throw new BadRequestException("File is not an image");
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    

    return {
      secureUrl

    };
  }

}
