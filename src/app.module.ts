import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
     ConfigModule.forRoot(),
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // set to false in production
     }),
     ProductsModule,
     CommonModule,
     SeedModule,
     FilesModule,
     ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public'), 
      }),
     AuthModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
