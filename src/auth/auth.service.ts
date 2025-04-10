import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/payload.interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Assuming you have a User entity defined
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), // Hash the password before saving
      });      

      await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user; // Exclude password from the response
      return {
        userWithoutPassword:user,
        token: this.generateJWT({ id: user.id }), // Generate JWT token
      };
    } catch (error) {
      this.handleDBUserError(error);
    }


  }


  async login (loginUserDto: LoginUserDto) {
    
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne(
          { where: { email } ,
          select: { email:true, password: true, id:true }
        });
       
        
      if (!user) 
        throw new BadRequestException('Invalid credentials');
      

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const {id, password: _, ...userWithoutPassword } = user; // Exclude password from the response
      return {
        userWithoutPassword,
        token: this.generateJWT({ id }), // Generate JWT token
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Rethrow the BadRequestException
      }
      this.handleDBUserError(error);
    }

  }


  private handleDBUserError(error: any):never {
    if (error.code === '23505') { // Unique violation error code for PostgreSQL
      throw new BadRequestException(error.detail); // or any other message you want to send
    }
    throw new InternalServerErrorException('Database error');
  }


  private generateJWT(payload: JwtPayload):string {
    const token = this.jwtService.sign( payload );
    return token;
  }

  
}
