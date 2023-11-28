import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './createFile.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
