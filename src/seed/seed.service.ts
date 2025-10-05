import { Injectable } from '@nestjs/common';
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
    /* hash password */

  const newUsers =  await this.userRepository.save(seedUsers);
    return newUsers[0];
  }


 async executeSeed(  ) {
   await this.deleteTables();
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

    // Generate and insert a massive dataset for performance testing
    async massiveProductsSeed(total = 100_000, chunkSize = 5_000) {
      // Ensure clean slate and a user to own the products
      await this.deleteTables();
      const user = await this.insertUsersSeed();

      const genders = ['men','women','kid','unisex'] as const;
      const sizesPool = ['XS','S','M','L','XL','XXL','XXXL'];

      const makeSlug = (title: string) => title
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/'/g, '');

      // Prepare insertion in chunks to keep memory and transaction sizes reasonable
      for (let start = 0; start < total; start += chunkSize) {
        const end = Math.min(start + chunkSize, total);
        const batch: any[] = [];
        for (let i = start; i < end; i++) {
          const title = `Perf Product ${i}`;
          const price = (i % 100) + 0.99;
          const stock = (i * 7) % 1000;
          const sizesCount = 1 + (i % sizesPool.length);
          const sizes = sizesPool.slice(0, sizesCount);
          const gender = genders[i % genders.length];
          const tags = [`tag${i % 10}`, `cat${i % 5}`];
          const slug = makeSlug(`${title}-${i}`); // unique slug

          batch.push({
            title,
            price,
            description: `Synthetic product ${i} for load testing` ,
            slug,
            stock,
            sizes,
            gender,
            tags,
            user: { id: user.id } as any, // minimal relation reference
          });
        }
        // Use bulk insert for speed
        await this.productService.bulkInsertProducts(batch);
      }

      return { inserted: total };
    }


}
