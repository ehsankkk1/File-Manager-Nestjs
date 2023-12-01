/*
https://docs.nestjs.com/controllers#controllers
*/
import { User } from '@prisma/client';
import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFolderDto, AddUserToFolderDto, DeleteFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { FolderAbilityFactory } from 'src/abilities/folder.ability.factory';
import { FolderAbilityGuard } from './guard';
import { CheckAbilities } from 'src/abilities/decorator';
import { Action } from 'src/abilities/variables';


@UseGuards(JwtGuard)
@Controller('myFolder')
export class FolderController {
    constructor(private folderService: FolderService, private folderAbilityFactory: FolderAbilityFactory) {

    }

    @Post('add')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Create, subject: "Folder" })
    addFolder(@Body() dto: AddFolderDto, @GetUser() user: User) {
        return this.folderService.addFolder(dto, user)
    }

    @Delete(':folderId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Delete, subject: "Folder" })
    async deleteFolder(@Body() dto: DeleteFolderDto, @GetUser() user: User) {
        return this.folderService.deleteFolder(dto, user)
    }

    @Patch(':folderId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Update, subject: "Folder" })
    updateFolder(
        @Body() dto: UpdateFolderDto,
        @GetUser() user: User,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.folderService.updateFolder(dto, folderId, user);
    }

    @Post(':folderId/addUser')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Add, subject: "Folder" })
    addUserToFolder(@Body() dto: AddUserToFolderDto, @GetUser() user: User) {
        return this.folderService.addUserToFolder(dto, user)
    }

    @Post(':folderId/removeUser')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Remove, subject: "Folder" })
    removeUserToFolder(@Body() dto: AddUserToFolderDto, @GetUser() user: User) {
        return this.folderService.addUserToFolder(dto, user)
    }
}
