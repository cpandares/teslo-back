import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async deleteTables(){
    
    await this.productService.deleteAllProducts();
    // await this.userRepository.delete({});

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .from(User)
      .where({})
      .execute();

  }

  private async insertUsersSeed() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });
  const newUsers =  await this.userRepository.save(seedUsers);
    return newUsers[0];
  }


 async executeSeed(  ) {
    this.deleteTables();
    const user  = await this.insertUsersSeed();

    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];
    products.forEach(product => {
      insertPromises.push( this.productService.create(product,user) );
    });

    await Promise.all(insertPromises);


    return 'Seed executed successfully!';
  }

  async deleteAllProducts() {
    await this.productService.deleteAllProducts();
  }


}
