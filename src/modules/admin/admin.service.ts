import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';

@Injectable()
export class AdminService extends BaseService {
  constructor() {
    super();
  }
}
