/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Res, Get, Post, Body, Patch, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, ParseIntPipe } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { FileAbilityFactory } from 'src/abilities/file.ability.factory';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { GetFileByFolderDto, CreateFileDto, UpdateFileDto } from './dto';
import { CheckAbilities } from 'src/abilities/decorator';
import { FileAbilityGuard } from 'src/file/guard';
import { Action } from 'src/abilities/variables';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';

@UseGuards(JwtGuard)
@Controller('files')
export class FileController {
    constructor(
        private fileService: FileService,
        private abilityFactory: FileAbilityFactory
    ) { }

    @Get()
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFilesByFolderId(@GetUser() user: User, @Query() dto: GetFileByFolderDto) {

        return this.fileService.getFiles(user, dto);
    }

    //return a resource of a file from database
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fileService.findById(+id);
    }

    @Patch('update-file/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateFile(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 3000000 }),
        ]
    })) file: Express.Multer.File,
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() body
    ) {
        const existingFile = await this.fileService.findById(id);
        let newFilePath = existingFile.link;
        const fs = require('fs');

        if (file) {
            // If a new file is uploaded, remove the old file and save the new one
            await fs.unlinkSync(existingFile.link);
            newFilePath = file.path;
        }

        const updatedFile = new UpdateFileDto();
        updatedFile.title = body.title;
        updatedFile.link = newFilePath;

        this.fileService.update(id, updatedFile, user);
        return { message: 'File updated successfully' };
    }

    //upload file with validation on file size
    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 3000000 }),
        ]
    })) file: Express.Multer.File,
        @GetUser() user: User,
        @Body() body
    ) {
        const dto = new CreateFileDto();
        dto.title = body.title;
        dto.link = file.path
        return this.fileService.createFile(dto, user);
    }


    //download file
    @Get('download-file')
    downloadFile(@Res() res: any, @Body() body: any) {
        if (body.path) {
            return res.sendFile(body.path);
        }
    }

    //checkin file
    @Post('checkin-file/:id')
    checkInFile(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.fileService.checkinfile(id, user);
    }

    //checkout file
    @Post('checkout-file/:id')
    checkoutFile(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.fileService.checkoutfile(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fileService.remove(+id);
    }
}
