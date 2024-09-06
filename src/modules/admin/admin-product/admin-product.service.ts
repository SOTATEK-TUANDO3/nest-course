import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';

@Injectable()
export class AdminProductService extends BaseService {
  constructor() {
    super();
  }

  async createProduct() {}

  async updateProduct() {}

  async deleteProduct() {}
}
