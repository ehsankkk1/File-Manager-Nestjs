/*
https://docs.nestjs.com/controllers#controllers
*/
import { User } from '@prisma/client';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto';
import { FolderService } from './folder.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService) { }
    @Post('add')
    addFolder(@GetUser() user: User, @Body() dto: FolderDto) {
        return this.folderService.addFolder(dto, user)
    }
}
