/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User, File } from '@prisma/client';
import { FileAbilityFactory } from 'src/abilities/file.ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetFileByFolderDto, CreateFileDto, UpdateFileDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService,
    private abilityFactory: FileAbilityFactory
  ) { }

  async getFiles(user: User, dto: GetFileByFolderDto) {

    return this.prisma.file.findMany({
      where: {
        folderId: dto.folderId,
      }
    });
  }


  async createFile(dto: CreateFileDto, user: User) {
    const file = await this.prisma.file.create({
      data: {
        title: dto.title,
        link: dto.link,
        user: {
          connect: {
            id: user.id,
          }
        },
      },
    })
    return file;
  }

  findById(id: number) {
    return this.prisma.file.findFirst({
      where: {
        id: id,
      }
    });
  }

  checkinfile(id: number, user: User) {
    const file = this.prisma.file.update({
      where: { id: Number(id) },
      data: { isAvailable: false },
    });
    this.createFileEvent("checkedout", user, id);
    return file;
  }

  checkoutfile(id: number, user: User) {
    const file = this.prisma.file.update({
      where: { id: Number(id) },
      data: { isAvailable: true },
    });
    this.createFileEvent("checkedin", user, id)
    return file;
  }

  createFileEvent(event_Name, user: User, id: number) {
    return this.prisma.fileEvent.create({
      data: {
        eventName: event_Name,
        user: {
          connect: {
            id: user.id,
          }
        },
        file: {
          connect: {
            id: id,
          }
        }
      }
    });
  }


  update(id: number, updateFileDto: UpdateFileDto, user: User) {

  }

  remove(id: number) {

  }
}


