import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

class UserWithToken {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token',
  })
  token: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserWithToken,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    type: UserWithToken,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Returns the user and renewed token',
    type: UserWithToken,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'Test for private routes, returns the user and raw headers',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  privateRoute(@GetUser() user: User, @RawHeaders() rawHeaders: string[]) {
    return { user, rawHeaders };
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin'])
  @RoleProtected(ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Test for private routes, returns the user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  privateRoute2(@GetUser() user: User) {
    return { user };
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Test for private routes, returns the user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  privateRoute3(@GetUser() user: User) {
    return { user };
  }
}
