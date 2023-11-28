import { PipeTransform, ArgumentMetadata, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MaxFileSizeValidator<T extends Express.Multer.File> implements PipeTransform<T, T> {
  constructor(private readonly maxFileSize: number) {}

  transform(file: T, metadata: ArgumentMetadata): T {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds maximum limit');
    }

    return file;
  }
}