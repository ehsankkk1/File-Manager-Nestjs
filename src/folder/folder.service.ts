/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
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
        var folder = await this.prisma.folder.findUnique({
            where: {
                id: dto.id
            }
        })
        if (folder == null) {
            return "Not Found"
        }
        //check if the user is the owner of the folder
        else if (folder.userId == user.id) {
            //delete folder
            await this.prisma.folder.delete({
                where: {
                    id: dto.id,
                }
            });
            return 'Deleted Successfully';
        }
        else {
            return "You Cannot Delete This Folder!"
        }
    }
    async updateFolder(dto: UpdateFolderDto, user: User) {
        //check if the folder exist
        var folder = await this.prisma.folder.findUnique({
            where: {
                id: dto.id
            }
        })
        if (folder == null) {
            return "Not Found"
        }
        //check if the user is the owner of the folder
        else if (folder.userId == user.id) {
            //update folder
            await this.prisma.folder.update({
                where: {
                    id: dto.id
                },
                data: {
                    title: dto.name
                }
            });
            return 'Updated Successfully';
        }
        else {
            return "You Cannot Update This Folder!"
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
