import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, MethodNotAllowedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() _createProductDto: CreateProductDto,
    @GetUser() _user: User
  ) {
    throw new MethodNotAllowedException('Read-only mode: creating products is disabled');
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() _updateProductDto: UpdateProductDto,
    @GetUser() _user: User
  ) {
    throw new MethodNotAllowedException('Read-only mode: updating products is disabled');
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    throw new MethodNotAllowedException('Read-only mode: deleting products is disabled');
  }
}
