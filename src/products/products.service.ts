import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {

      this.handleDBErrors(error);

     
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto;
    const products = this.productRepository.find({
      skip: offset,
      take: limit,
    });
    return products;
  }

  async findOne(term: string) {


    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term }) as Product;
    }else{
      //product = await this.productRepository.findOneBy({ slug: term }) as Product;
      const query = this.productRepository.createQueryBuilder();
      product = await query.where('UPPER(title) =:title or slug =:slug', { title: term.toLocaleUpperCase(), slug: term })
        .getOne() as Product; 
    } 
    
    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    } 
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
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

}
