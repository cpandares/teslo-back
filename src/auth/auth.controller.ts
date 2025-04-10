import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto,CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';

import { Request } from 'express';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

import { ValidRoles } from './interfaces';
import { Auth,GetUser,GetRawHeader,RoleProtected } from './decorators';


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

  @Get('check-status')
  @UseGuards( AuthGuard() )
  checkAuthStatus(
    @GetUser() user: User,
  ){
   return this.authService.checkAuthStatus(user);
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
