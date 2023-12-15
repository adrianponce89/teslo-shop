import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadProductImage(file: Express.Multer.File) {
    return file;
  }
}
