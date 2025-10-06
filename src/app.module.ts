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
import { MessagesWsModule } from './messages-ws/messages-ws.module';


@Module({
  imports: [
     ConfigModule.forRoot(),
     TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
        // Never auto-sync schema in read-only mode to avoid ALTER TABLE attempts
        synchronize: process.env.DB_SYNC === 'true',
      dropSchema: process.env.DB_DROP_SCHEMA === 'true', // useful for dev to rebuild schema
      options: {
        encrypt: true,
        trustServerCertificate: true, // Permite certificados self-signed
      },
     }),

     ProductsModule,
     CommonModule,
     SeedModule,
     FilesModule,
     ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public'), 
      }),
     AuthModule,
     MessagesWsModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
