import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('order product')
@Controller('order')
export class OrderController {
  constructor() {}
}
