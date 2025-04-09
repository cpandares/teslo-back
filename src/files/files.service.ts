import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';


@Injectable()
export class FilesService {
  

  getProductImage(imageName: string) {

    const path = join(__dirname, '../../uploads/products', imageName);

    if(!existsSync(path)){
      throw new BadRequestException(`Image with name ${imageName} not found`);
    }

    return path;
  }

}
