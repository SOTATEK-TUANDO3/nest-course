import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Request reset password' })
  @Post('request-reset-password')
  async requestResetPassword() {}

  @ApiOperation({ summary: 'Reset password' })
  @Patch('change-password')
  async resetPassword(@Body() changepasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changepasswordDto);
  }
}
