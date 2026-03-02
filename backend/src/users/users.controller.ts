import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    const userId = Number(req.user.userId);
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  update(@Req() req: any, @Body() body: { name: string }) {
    const userId = Number(req.user.userId);
    return this.usersService.updateName(userId, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  updateAvatar(@Req() req: any, @Body() body: { avatar?: string }) {
    const userId = Number(req.user.userId);
    const avatar = body.avatar && body.avatar.trim().length > 0 ? body.avatar : null;
    return this.usersService.updateAvatar(userId, avatar);
  }
}
