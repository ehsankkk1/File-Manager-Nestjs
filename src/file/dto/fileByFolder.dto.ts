import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class FolderIdQueryDto {

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  folderId: number;
}