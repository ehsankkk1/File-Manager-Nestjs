/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto';

@Injectable()
export class FolderService {

    constructor(private prisma: PrismaService) { }

    // check if user has permissions to access folder 
    async checkFolderPermission(user: number, folder: number): Promise<boolean> {

        const canUserAccess = await this.prisma.folderPermission.findFirst({
            where: {
                userId: user,
                folderId: folder,
            }
        });
        if (canUserAccess) {
            return true;
        }

        return false;
    }
    async addFolder(dto: FolderDto) {
        const folder = await this.prisma.folder.create({
            data: {
                title: dto.name
            }
        })
        return folder;

    }
}
