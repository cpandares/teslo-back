import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async deleteTables(){
    throw new MethodNotAllowedException('Read-only mode: deleteTables is disabled');
  }

  private async insertUsersSeed() {
    throw new MethodNotAllowedException('Read-only mode: insertUsersSeed is disabled');
  }


 async executeSeed(  ) {
   throw new MethodNotAllowedException('Read-only mode: executeSeed is disabled');
 }

  async deleteAllProducts() {
    throw new MethodNotAllowedException('Read-only mode: deleteAllProducts is disabled');
  }

    // Generate and insert a massive dataset for performance testing
    async massiveProductsSeed(total = 100_000, chunkSize = 5_000) {
      throw new MethodNotAllowedException('Read-only mode: massiveProductsSeed is disabled');
    }


}
