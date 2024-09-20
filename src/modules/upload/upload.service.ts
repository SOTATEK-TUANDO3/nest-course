import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';

@Injectable()
export class UploadService extends BaseService {
  constructor() {
    super();
  }

  async uploadImg(files: Array<Express.Multer.File>) {
    return files;
  }
}
