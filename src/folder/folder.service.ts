/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFolderDto, UpdateFolderDto } from './dto';
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
        return await this.prisma.folder.findMany({})
    }
    
    async getFoldersCanAccess(user: User) {
        const myPermissions = await this.prisma.folderPermission.findMany({
            where: {
                userId: user.id,
            },
            select:{
                folder: true,
            }
        });
        // Extract list of folders
        const folders = myPermissions.map(item => item.folder);

        return folders;
    }

    async getFolderAllUsers(folderId:number, user: User) {
        console.log("Folders adsfklnfksdnaskdnfkas")
        const myPermissions = await this.prisma.folderPermission.findMany({
            where: {
                folderId: folderId,
            },
            select:{
                user: true,
            }
        });
        // Extract list of folders
        const users = myPermissions.map(item => item.user);

        return users;
    }

    async getMyFolders(user: User) {
        const myFolders = await this.prisma.folder.findMany({
            where: {
                userId: user.id,
            },
        });
        return myFolders;
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
        });
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
            return e.message;
        }
    }

    //delete
    async deleteFolder(folderId: number) {
        //check if the folder exist
        try {
            return await this.prisma.folder.delete({
                where: {
                    id: folderId,
                }
            });
        } catch (e) {
            if (e.code == 'P2025') {
                throw new NotFoundException("Folder not found");
            }
        }
    }

    async addUserToFolder(folderId: number, email: string) {
        const user = await this.getUserByEmail(email)
        try {
            return await this.prisma.folderPermission.create({
                data: {
                    folderId: folderId,
                    userId: user.id,
                }
            })
        } catch (e) {
            // already exists code (unique restriction)
            if (e.code == 'P2002') {
                throw new ConflictException("User already have permission");
            }
        }
    }
    async removeUserFromFolder(folderId: number, userId: number) {
        try {
            return await this.prisma.folderPermission.delete({
                where: {
                    userId_folderId: { userId: userId, folderId: folderId },
                }
            });
        } catch (e) {
            if (e.code == 'P2025') {
                throw new NotFoundException("Permission not found");
            }
        }
    }
    async getUserByEmail(email: string){
        const user = await this.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if(user){
            return user;
        }else{
            throw new NotFoundException("User not found");
        }
    }
}
