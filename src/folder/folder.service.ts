/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FolderService {

    constructor(private prisma: PrismaService) { }
    
    async checkFolderPermission(user: number, folder: number): Promise<boolean> {

        const canUserAccess = await this.prisma.folderPermission.findFirst({
            where: {
                userId: user,
                folderId: folder,
            }
        });
        if(canUserAccess){
            return true;
        }

        return false;
    }
}
