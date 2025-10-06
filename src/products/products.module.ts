import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product,ProductImage, Articulo } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';



@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Articulo,
    ]),
    AuthModule,
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]
})
export class ProductsModule {}
