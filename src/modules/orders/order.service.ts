import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';

@Injectable()
export class OrderService extends BaseService {
  constructor() {
    super();
  }

  async createOrder() {}
}
