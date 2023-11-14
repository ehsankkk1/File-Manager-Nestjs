import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class GetFileByFolderDto {

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  folderId: number;
}