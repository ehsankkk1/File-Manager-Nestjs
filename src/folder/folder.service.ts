/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFolderDto, AddUserToFolderDto, DeleteFolderDto, UpdateFolderDto } from './dto';
import { User } from '@prisma/client';

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
    async checkIfFolderCreator(user: number, folder: number): Promise<boolean> {
        const canUserAccess = await this.prisma.folder.findFirst({
            where: {
                id: folder,
                userId: user,
            }
        });
        if (canUserAccess) {
            return true;
        }
        return false;
    }
    findById(folderId: number) {
        return this.prisma.folder.findFirst({
            where: {
                id: folderId
            },
        });
    }
    async addFolder(dto: AddFolderDto, user: User) {
        const folder = await this.prisma.folder.create({
            data: {
                title: dto.name,
                userId: user.id
            }
        })
        return folder;
    }
    async deleteFolder(dto: DeleteFolderDto, user: User) {
        //check if the folder exist
        try {
            return await this.prisma.folder.delete({
                where: {
                    id: dto.id,
                }
            });
        } catch (e) {
            if (e.code == 'P2025') {
                throw new ForbiddenException("Folder not found");
            }
        }
    }
    async updateFolder(dto: UpdateFolderDto, folderId: number, user: User) {
        //check if the folder exist
        try {
            await this.prisma.folder.update({
                where: {
                    id: folderId
                },
                data: {
                    title: dto.name
                }
            });
        } catch (e) {
            if (e.code == 'P2025') {
                throw new ForbiddenException("Folder not found");
            }
        }
    }
    async addUserToFolder(dto: AddUserToFolderDto, user: User) {
        //check if the folder exist
        var folder = await this.prisma.folder.findUnique({
            where: {
                id: dto.folderId
            }
        })
        if (folder == null) {
            return "Not Found"
        }
        //check if the user is the owner of the folder
        else if (folder.userId == user.id) {
            //add user to folder
            await this.prisma.folder.update({
                where: {
                    id: dto.folderId
                },
                data: {
                    //User:
                }
            });
            return 'Updated Successfully';
        }
        else {
            return "You Cannot Update This Folder!"
        }
    }
}
