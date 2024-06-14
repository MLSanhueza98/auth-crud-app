import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto/';

import { User } from './entities/user.entity';
import { JwtPayload } from './strategies/interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService

  ) {}

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      })
      
      await  this.userRepository.save( user )
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch ( error ) {
      this.handleErrorsDb( error )
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if ( !user )
      throw new UnauthorizedException('invalid credentials')

    if ( !bcrypt.compareSync( password, user.password ))
      throw new UnauthorizedException('invalid credentials')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }


  private getJwtToken( payload: JwtPayload ) {
    return this.jwtService.sign( payload )
  }

  private handleErrorsDb( error: any ): never {
    if( error.code === '23505' )
      throw new BadRequestException(error.detail)
    
    console.log(error)
    throw new InternalServerErrorException( 'please check server logs' )
  }
}
