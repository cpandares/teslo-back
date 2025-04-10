import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage,Product } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });
      await this.productRepository.save(product);
      return {
        ...product,
        images,
      };
    } catch (error) {

      this.handleDBErrors(error);

     
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto;
    const products = await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: {
        images: true,
      },
    });
    return products.map( product => ({
      ...product,
      images: product.images?.map( image => image.url )
    }) )
  }

  async findOne(term: string) {


    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term }) as Product;
    }else{
      //product = await this.productRepository.findOneBy({ slug: term }) as Product;
      const query = this.productRepository.createQueryBuilder('prod');
      product = await query.where('UPPER(title) =:title or slug =:slug', { title: term.toLocaleUpperCase(), slug: term })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne() as Product; 
    } 
    
    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    } 
    return product;
  }

  async findOnePlain(term: string) {
    const { images, ...product } = await this.findOne(term);
    return {
      ...product,
      images: images?.map(image => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User ) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // If images are provided, update them
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Delete old images
        await this.productImageRepository.delete({ product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));

      }else{
        // If no images are provided, keep the existing images
        const existingProduct = await this.productRepository.findOneBy({ id });
        product.images = existingProduct?.images;
      }
      product.user = user; // Update the user who modified the product
      await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error('Transaction failed', error);
      this.handleDBErrors(error);
    }


  }

  async remove(id: string) {
    await this.findOne(id); // Check if the product exists before trying to delete it
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }


  private handleDBErrors(error: any) {
    if (error.code === '23505') {
      this.logger.error('Product already exists in DB', error.detail);
      throw new BadRequestException(error.detail);
    }

    this.logger.error('Unknown error', error);
    throw new InternalServerErrorException('Please check server logs');
  }


  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

}
