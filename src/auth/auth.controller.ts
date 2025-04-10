import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto,CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeader } from './decorators/get-raw-headers';
import { Request } from 'express';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() req: Request,
    @GetUser() user: User,
    @GetUser('email') email: string,
    
    @GetRawHeader() rawHeaders: string[],
  ){

    return {
      ok: true,
      message: 'You have access to this private route',
      user,
      email,
      rawHeaders,
    }
  }
  // @SetMetadata('roles', ['admin'])

  @Get('private2')
  @RoleProtected( ValidRoles.admin, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(){

    return {
        ok: true,
        message: 'You have access to this private route 2',
      }
  }


  @Get('private3')
  @Auth( ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute3(){

    return {
        ok: true,
        message: 'You have access to this private route 3 ',
      }
  }

 
}
