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
import { FileValidationUploadInterceptor } from './interceptor/fileValidationUpload.interceptor';

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
    @UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file'))

    async updateFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateFileDto
    ) {
        return this.fileService.updateFile(id, dto, file.path, user);
    }

    @Post('upload-file')
    @UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
        @Body() dto: CreateFileDto
    ) {
        return this.fileService.createFile(dto, file.path, user);
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
