import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateProfileDto })
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.update(req.user.userId, updateProfileDto);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({ type: ChangePasswordDto })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(
      req.user.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}

