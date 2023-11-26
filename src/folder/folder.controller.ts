/*
https://docs.nestjs.com/controllers#controllers
*/
import { User } from '@prisma/client';
import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFolderDto, DeleteFolderDto, UpdateFolderDto } from './dto';
import { FolderService } from './folder.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService) { }
    @Post('add')
    addFolder(@Body() dto: AddFolderDto, @GetUser() user: User) {
        return this.folderService.addFolder(dto, user)
    }
    @Delete('delete')
    deleteFolder(@Body() dto: DeleteFolderDto, @GetUser() user: User) {
        return this.folderService.deleteFolder(dto, user)
    }
    @Post('update')
    updateFolder(@Body() dto: UpdateFolderDto, @GetUser() user: User) {
        return this.folderService.updateFolder(dto, user)
    }
}
