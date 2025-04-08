import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) {}


 async executeSeed() {
    this.deleteAllProducts();

    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];
    products.forEach(product => {
      insertPromises.push( this.productService.create(product) );
    });

    await Promise.all(insertPromises);


    return 'Seed executed successfully!';
  }

  async deleteAllProducts() {
    await this.productService.deleteAllProducts();
  }


}
