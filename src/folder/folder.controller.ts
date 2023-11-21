/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('folders')
export class FolderController {
    @Post('add')
    addFolder() { }
}
