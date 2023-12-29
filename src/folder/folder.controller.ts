/*
https://docs.nestjs.com/controllers#controllers
*/
import { User } from '@prisma/client';
import { Body, Controller, Delete, Get, Res, Param, ParseIntPipe, Patch, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { AddFolderDto, DeleteFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { FolderAbilityGuard } from './guard';
import { CheckAbilities } from 'src/abilities/decorator';
import { Action } from 'src/abilities/variables';


@UseGuards(JwtGuard)
@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService) { }

    @Get()
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "Folder" })
    getAllFolders() {
        return this.folderService.getAllFolders();
    }

    @Get('can-access')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "Folder" })
    getFoldersCanAccess(@GetUser() user: User) {
        return this.folderService.getFoldersCanAccess(user);
    }

    @Get('my-folders')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "Folder" })
    getMyFolders(@GetUser() user: User) {
        return this.folderService.getMyFolders(user);
    }

    @Get(':folderId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Update, subject: "Folder" })
    getOneFolder(
        @GetUser() user: User,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.folderService.findById(folderId);
    }

    @Post()
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Create, subject: "Folder" })
    addFolder(
        @Body() dto: AddFolderDto,
        @GetUser() user: User) {
        return this.folderService.addFolder(dto, user)
    }

    @Patch(':folderId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Update, subject: "Folder" })
    updateFolder(
        @Body() dto: UpdateFolderDto,
        @GetUser() user: User,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.folderService.updateFolder(dto, folderId);
    }


    @Delete(':folderId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Delete, subject: "Folder" })
    async deleteFolder(@Param('folderId', ParseIntPipe) folderId: number) {
        return this.folderService.deleteFolder(folderId);
    }



    @Get('/:folderId/users')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "Folder" })
    getFoldersUsers(
        @Param('folderId', ParseIntPipe) folderId: number,
        @GetUser() user: User) {
        return this.folderService.getFolderAllUsers(folderId ,user);
    }

    @Post('/:folderId/add-user/:email')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Add, subject: "Folder" })
    addUserToFolder(
        @Param('folderId', ParseIntPipe) folderId: number,
        @Param('email') email: string) {
        return this.folderService.addUserToFolder(folderId, email)
    }

    @Delete('/:folderId/remove-user/:userId')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Remove, subject: "Folder" })
    removeUserFromFolder(
        @Param('folderId', ParseIntPipe) folderId: number,
        @Param('userId', ParseIntPipe) userId: number) {
        return this.folderService.removeUserFromFolder(folderId, userId)
    }

}
