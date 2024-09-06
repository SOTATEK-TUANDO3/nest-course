import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.ADMIN)
@ApiTags('Admin Product')
@Controller('admin/product')
export class AdminProductController {
  constructor() {}

  @ApiOperation({ summary: 'Create new product' })
  @Post()
  async createProduct() {
    return this.createProduct();
  }
}
