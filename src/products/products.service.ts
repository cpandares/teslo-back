import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, MethodNotAllowedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage,Product, Articulo } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    throw new MethodNotAllowedException('Read-only mode: create is disabled');
  }

  // High-throughput bulk insert for massive seeding. Expects pre-validated and unique fields (title, slug).
  async bulkInsertProducts(products: Array<Partial<Product>>) {
    throw new MethodNotAllowedException('Read-only mode: bulk insert is disabled');
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto;
    const [items, total] = await this.articuloRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    });

    return items.map((a) => ({
      totalRegistros: total,
      id: String(a.id),
      title: a.descripcion ?? a.codigo ?? `Articulo ${a.id}`,
      price: a.precio ?? 0,
      description: a.composicion ?? null,
      slug: (a.descripcion ?? `articulo_${a.id}`).toLowerCase().replace(/\s+/g, '_'),
      stock: a.cantidad ?? 0,
      sizes: [],
      gender: 'unisex',
      tags: [a.departamento, a.categoria, a.cod_departamento].filter(Boolean) as string[],
      images: [],
    }));
  }

  async findOne(term: string) {
    // Search articulos by id or code/description
    let articulo: Articulo | null = null;
    if (isUUID(term)) {
      // UUID no aplica en articulos; intenta parsear a int
      articulo = null;
    }

    // Try by numeric id
    const idNum = Number(term);
    if (!articulo && Number.isInteger(idNum)) {
      articulo = await this.articuloRepository.findOne({ where: { id: idNum } });
    }

    // Try by codigo or descripcion (case-insensitive contains)
    if (!articulo) {
      articulo = await this.articuloRepository.createQueryBuilder('a')
        .where('a.codigo = :codigo', { codigo: term })
        .orWhere('UPPER(a.descripcion) = :desc', { desc: term.toUpperCase() })
        .getOne();
    }

    if (!articulo) {
      throw new NotFoundException(`Articulo not found for term ${term}`);
    }
    // Map to product-like shape
    return {
      id: String(articulo.id),
      title: articulo.descripcion ?? articulo.codigo ?? `Articulo ${articulo.id}`,
      price: articulo.precio ?? 0,
      description: articulo.composicion ?? null,
      slug: (articulo.descripcion ?? `articulo_${articulo.id}`).toLowerCase().replace(/\s+/g, '_'),
      stock: articulo.cantidad ?? 0,
      sizes: [],
      gender: 'unisex',
      tags: [articulo.departamento, articulo.categoria, articulo.cod_departamento].filter(Boolean) as string[],
      images: [],
    } as any;
  }

  async findOnePlain(term: string) {
    // findOne already returns a plain object in read-only mapping
    return await this.findOne(term);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User ) {
    throw new MethodNotAllowedException('Read-only mode: update is disabled');


  }

  async remove(id: string) {
    throw new MethodNotAllowedException('Read-only mode: delete is disabled');
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
    throw new MethodNotAllowedException('Read-only mode: deleteAllProducts is disabled');
  }

}
