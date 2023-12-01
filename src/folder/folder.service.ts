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
    async getAllFolders() {
        const folder = await this.prisma.folder.findMany({
        })
        return folder;
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
    async deleteFolder(dto: DeleteFolderDto) {
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
    async updateFolder(dto: UpdateFolderDto, folderId: number) {
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
    async addUserToFolder(folderId: number, userId: number) {
        await this.prisma.folderPermission.create({
            data: {
                userId: userId,
                folderId: folderId
            }
        })

    }
    async removeUserFromFolder(folderId: number, userId: number) {
        try {
            const permission = await this.prisma.folderPermission.findFirst({
                where: {
                    folderId: folderId,
                    userId: userId
                }
            });
            return await this.prisma.folderPermission.delete({
                where: {
                    id: permission.id
                }
            })
        } catch (e) {
            if (e.code == 'P2025') {
                throw new ForbiddenException("Folder not found");
            }
        }

    }
}
