/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    //index
    async getAllFolders() {
        return await this.prisma.folder.findMany({
        })
    }

    //show
    findById(folderId: number) {
        return this.prisma.folder.findFirst({
            where: {
                id: folderId
            },
        });
    }


    //create
    async addFolder(dto: AddFolderDto, user: User) {
        const folder = await this.prisma.folder.create({
            data: {
                title: dto.name,
                userId: user.id
            }
        })

        await this.prisma.folderPermission.create({
            data: {
                userId: user.id,
                folderId: folder.id
            }
        })
        return folder;
    }

    //update
    async updateFolder(dto: UpdateFolderDto, folderId: number) {
        //check if the folder exist
        try {
            return await this.prisma.folder.update({
                where: {
                    id: folderId
                },
                data: {
                    title: dto.name
                }
            });
        } catch (e) {
            if (e.code == 'P2003') {
                throw new NotFoundException("Folder not found");
            }
        }
    }

    //delete
    async deleteFolder(folderId: number) {
        //check if the folder exist
        try {
            await this.prisma.folder.delete({
                where: {
                    id: folderId,
                }
            });
            return "folder deleted successfully."
        } catch (e) {
            if (e.code == 'P2003') {
                throw new NotFoundException("Folder not found");
            }
        }
    }

    async addUserToFolder(folderId: number, userId: number) {
        const exists = !!await this.prisma.folderPermission.findFirst(
            {
                where: {
                    folderId: folderId,
                    userId: userId

                }
            }
        );
        if (exists) { return "User already has this permission" }
        else {
            return await this.prisma.folderPermission.create({
                data: {
                    userId: userId,
                    folderId: folderId
                }
            })
        }

    }
    async removeUserFromFolder(folderId: number, userId: number) {
        try {
            const permission = await this.prisma.folderPermission.findFirst({
                where: {
                    folderId: folderId,
                    userId: userId
                }
            });
            if (!(!!permission)) {
                return "User doesn't have this permission"
            }
            else {
                await this.prisma.folderPermission.delete({
                    where: {
                        id: permission.id
                    }
                })
                return "permission deleted successfully"
            }
        } catch (e) {
            if (e.code == 'P2003') {
                throw new NotFoundException("Folder not found");
            }
        }
    }
}
