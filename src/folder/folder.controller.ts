/*
https://docs.nestjs.com/controllers#controllers
*/
import { User } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AddFolderDto, DeleteFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { FolderAbilityGuard } from './guard';
import { CheckAbilities } from 'src/abilities/decorator';
import { Action } from 'src/abilities/variables';


@UseGuards(JwtGuard)
@Controller('myFolder')
export class FolderController {
    constructor(private folderService: FolderService) { }

    @Get('getAll')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Create, subject: "Folder" })
    getAllFolders() {
        return this.folderService.getAllFolders()
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
        return this.folderService.deleteFolder(dto)
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

    @Post(':userId/:folderId/addUser')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Add, subject: "Folder" })
    addUserToFolder(@Param('folderId', ParseIntPipe) folderId: number, @Param('userId', ParseIntPipe) userId: number) {
        return this.folderService.addUserToFolder(folderId, userId)
    }

    @Post(':userId/:folderId/removeUser')
    @UseGuards(FolderAbilityGuard)
    @CheckAbilities({ action: Action.Remove, subject: "Folder" })
    removeUserFromFolder(@Param('folderId', ParseIntPipe) folderId: number, @Param('userId', ParseIntPipe) userId: number) {
        return this.folderService.removeUserFromFolder(folderId, userId)
    }

}
