import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { GetUser } from '../common/decorator';
import { User } from '../database/schema';
import { JwtGuard, RolesGuard } from '../common/guard';
import { UsersService } from './users.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return {
      status: HttpStatus.OK,
      message: 'User fetched successfully.',
      data: user,
    };
  }

  @Get('network')
  async getNetwork(@GetUser() user: User) {
    return {
      status: HttpStatus.OK,
      message: 'Network fetched successfully.',
      data: await this.userService.getNetwork(user.id),
    };
  }
}
