import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin/product')
export class AdminController {
  constructor() {}
}
