/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto, UpdateFileDto } from './dto';
import { FileEventService } from 'src/file-event/file-event.service';
import { FileEventEnum } from 'src/file-event/enum';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private fileEventService: FileEventService
  ) { }

  async getFiles(folderId: number) {

    return this.prisma.file.findMany({
      where: {
        folderId: folderId,
      }
    });

  }

  findById(folderId: number,id: number) {
    return this.prisma.file.findFirst({
      where: {
        id: id,
        folderId: folderId,
      },
      include: {
        fileEvent: true,
      }
    });
  }

  async createFile(dto: CreateFileDto,folderId: number, link: string, user: User) {
    const file = await this.prisma.file.create({
      data: {
        title: dto.title,
        link: link,
        user: {
          connect: {
            id: user.id,
          }
        },
        folder:{
          connect:{
            id: folderId,
          }
        }
      },
    })
    return file;
  }



  async updateFile(id: number, updateFileDto: UpdateFileDto, link: string, user: User) {
    try {
      // create update event 
      await this.fileEventService.createFileEvent(FileEventEnum.Updated, user, id);

      //try to update the file if available 
      return await this.prisma.file.update({
        where: { id: id },
        data: {
          title: updateFileDto.title,
          link: link,
        },
      });
    } catch (e) {
      if (e.code == 'P2025') {
        throw new ForbiddenException("File not found");
      }
    }
  }

  async checkinfile(id: number, user: User) {

    //try to update the file if available 
    try {
      const file = await this.prisma.file.update({
        where: { id: Number(id) },
        data: { isAvailable: false },
      });
      await this.fileEventService.createFileEvent(FileEventEnum.CheckIn, user, id);
      return file;
    } catch (e) {
      if (e.code == 'P2025') {
        throw new ForbiddenException("File not found");
      }
    }
  }

  async checkoutfile(id: number, user: User) {
    try{
       const file = await this.prisma.file.update({
      where: { id: Number(id) },
      data: { isAvailable: true },
    });
    await this.fileEventService.createFileEvent(FileEventEnum.CheckOut, user, id)
    return file;
    }catch (e) {
      if (e.code == 'P2025') {
        throw new ForbiddenException("File not found");
      }
    }
  }

  remove(id: number) {

  }

}


