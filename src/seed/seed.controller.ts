import { Controller, Get, Post, Body, Patch, Param, Delete, Query, MethodNotAllowedException } from '@nestjs/common';
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
    throw new MethodNotAllowedException('Read-only mode: seeding is disabled');
  }

  @Get('massive')
  // @Auth(ValidRoles.admin)
  massiveSeed(
    @Query('total') total?: string,
    @Query('chunk') chunk?: string
  ) {
    throw new MethodNotAllowedException('Read-only mode: massive seeding is disabled');
  }

}
