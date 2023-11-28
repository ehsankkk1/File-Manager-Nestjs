/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { FileAbilityFactory } from 'src/abilities/file.ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetFileByFolderDto, CreateFileDto, UpdateFileDto } from './dto';

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


  async createFile(dto: CreateFileDto, link: string, user: User) {
    const file = await this.prisma.file.create({
      data: {
        title: dto.title,
        link: link,
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

  async updateFile(id: number, updateFileDto: UpdateFileDto, link: string, user: User) {

    try{
      return await this.prisma.file.update({
        where: { id: id },
        data: {
          title: updateFileDto.title,
          link: link,
        },
      });
    }catch(e){
      // check if file not availabel error
      if(e.code == 'P2025'){
        throw new ForbiddenException("File not found");
      }
    }
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

  remove(id: number) {

  }
}


