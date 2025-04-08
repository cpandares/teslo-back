import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    const productos = this.productRepository.find({});
    return productos;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
