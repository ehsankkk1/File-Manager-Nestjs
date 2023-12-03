
import { Folder } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FolderEntity implements Folder {

  userId: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  createdAt: Date;
  updatedAt: Date;
}