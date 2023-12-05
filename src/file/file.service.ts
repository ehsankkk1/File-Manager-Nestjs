/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from './dto';
import { UpdateFileDto } from './dto/updateFile.dto';
import { FileEventService } from 'src/file-event/file-event.service';
import { FileEventEnum } from 'src/file-event/enum';
import { CheckAbilities } from 'src/abilities/decorator';
import { Action } from 'src/abilities/variables';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as fs from 'fs';
import { resolve } from 'path';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private fileEventService: FileEventService
  ) { }

  //index
  async getAll(folderId: number) {
    return this.prisma.file.findMany({
      where: {
        folderId: folderId,
      },
      include: {
        checkedInUser:true,
        user: true,
        fileEvent: true,
        
      }
    });

  }

  //show
  async findById(id: number) {
    return this.prisma.file.findFirst({
      where: {
        id: id,
      },
      include: {
        fileEvent: true,
      }
    });
  }

  //create
  async create(dto: CreateFileDto, folderId: number, link: string, user: User) {
    try {
      let file = await this.prisma.file.create({
        data: {
          title: dto.title,
          link: link,
          user: {
            connect: {
              id: user.id,
            }
          },
          folder: {
            connect: {
              id: folderId,
            }
          }
        },
      })
      await this.fileEventService.createFileEvent(FileEventEnum.Create, user, file.id);
      return file;

    } catch (e) {
      return e.message;
    }
  }



  //update
  async update(id: number, updateFileDto: UpdateFileDto, user: User, file: Express.Multer.File) {
    try {
      // create update event 
      await this.fileEventService.createFileEvent(FileEventEnum.Updated, user, id);
      //try to update the file if available 
      const data: { title?: string; link?: string } = {};
      if (updateFileDto.title) {
        data.title = updateFileDto.title;
      }
      if (file) {
        data.link = file.path;
        const oldfile = this.findById(id);
        const filePath = resolve((await oldfile).link);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`File ${filePath} does not exist in uploads directory`);
        }
      }
      return await this.prisma.file.update({
        where: { id: id },
        data: data
      });
    } catch (e) {
      if (e.code == 'P2003') {
        throw new NotFoundException("file not found");
      } else {
        return e.message;
      }
    }
  }

  //delete
  async delete(id: number, user: User) {
    try {
      await this.prisma.file.delete({
        where: {
          id: id,
        }
      });
      await this.fileEventService.createFileEvent(FileEventEnum.Deleted, user, id);
      return { "message": "File deleted successfully." }
    } catch (e) {
      return e.message;
    }
  }

  //checkin user to a file
  @CheckAbilities({ action: Action.CheckIn, subject: "File" })
  async checkin(id: number, user: User) {
    //try to update the file if available 
    try {
      const file = this.checkinAction(this.prisma.file, id, user);
      await this.fileEventService.createFileEvent(FileEventEnum.CheckIn, user, id);
      return file;
    } catch (e) {
      return e.message;
    }
  }

  //checkin file
  async checkinAction(file: Prisma.FileDelegate<DefaultArgs>, id: number, user: User) {
    return await file.update({
      where: { id: Number(id) },
      data: { isAvailable: false, checkedInUserId: user.id },
    });
  }


  //checkin user into multiple files
  async checkInFiles(user: User, fileIds: number[]) {
    await this.prisma.$transaction(async (q) => {
      for (const fileId of fileIds) {
        let file = await q.file.findFirst({
          where: { id: fileId },
        });

        //check if file is available
        if (file.isAvailable == false) {
          throw new NotFoundException('All the files should be available for checking in');
        }
        else {
          await this.checkinAction(q.file, fileId, user);
        }
      }
    });
    return { "message": "All files have been checked in successfully." };
  }


  //checkout
  async checkout(id: number, user: User) {
    try {
      const file = await this.prisma.file.update({
        where: { id: Number(id) },
        data: { isAvailable: true, checkedInUserId: null },
      });
      await this.fileEventService.createFileEvent(FileEventEnum.CheckOut, user, id)
      return file;
    } catch (e) {
      return e.message;
    }
  }
}


