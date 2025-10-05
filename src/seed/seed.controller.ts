import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //@Auth(ValidRoles.user)
  executeSeed() {
    return this.seedService.executeSeed();
  }

  @Get('massive')
  // @Auth(ValidRoles.admin)
  massiveSeed(
    @Query('total') total?: string,
    @Query('chunk') chunk?: string
  ) {
    const totalNum = Math.max(1, Math.min(1_000_000, Number(total) || 100_000));
    const chunkNum = Math.max(500, Math.min(20_000, Number(chunk) || 5_000));
    return this.seedService.massiveProductsSeed(totalNum, chunkNum);
  }

}
