import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Public } from 'src/app/decorators/public';
import { UploadService } from './upload.service';

@ApiTags('Upload Image')
@ApiBearerAuth()
@Controller('upload/image')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Upload images' })
  @Public()
  @Post()
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      storage: diskStorage({
        destination: './uploadedFiles/product',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  async uploadImg(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadService.uploadImg(files);
  }
}
