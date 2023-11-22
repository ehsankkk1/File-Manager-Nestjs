/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from './dto';
import { FolderService } from './folder.service';

@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService) { }
    @Post('add')
    addFolder(@Body() dto: FolderDto) {
        console.log("controller");
        return this.folderService.addFolder(dto)
    }
}
