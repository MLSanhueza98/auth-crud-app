import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Services
import { AuthService } from './auth.service';

// Dtos
import { LoginUserDto, CreateUserDto } from './dto';

// Decorators
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators/';

// Entities
import { User } from './entities/user.entity';

// Guards
import { UserRolGuard } from './guards/user-rol.guard';
import { ValidRoles } from './strategies/interfaces';

@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard(), UserRolGuard )
  testPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    return {
      message: 'Bienvenido',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRolGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return{
      user
    }
  }


  @Get('private3')
  @Auth( ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {
    return{
      user
    }
  }

}
