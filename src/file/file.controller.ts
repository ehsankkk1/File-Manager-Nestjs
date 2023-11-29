/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Res, Get, Post, Body, Patch, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, ParseIntPipe, Logger } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateFileDto, UpdateFileDto } from './dto';
import { CheckAbilities } from 'src/abilities/decorator';
import { FileAbilityGuard } from 'src/file/guard';
import { Action } from 'src/abilities/variables';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { FileValidationUploadInterceptor } from './interceptor/fileValidationUpload.interceptor';

@UseGuards(JwtGuard)
@Controller('folders/:folderId')

export class FileController {
    constructor(private fileService: FileService) { }

    @Get('get-files')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFilesByFolderId(
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.fileService.getFiles(folderId);
    }

    @Get('get-files/:id')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFileById(
        @Param('id', ParseIntPipe) fileId: number,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.fileService.findById(folderId, fileId);
    }


    @Patch('update-file/:id')
    @UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Update, subject: "File" })
    async updateFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
        @Param('id', ParseIntPipe) fileId: number,
        @Body() dto: UpdateFileDto,
    ) {
        return this.fileService.updateFile(fileId, dto, file.path, user);
    }

    @Post('upload-file')
    @UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Create, subject: "File" })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
        @Body() dto: CreateFileDto,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.fileService.createFile(dto, folderId, file.path, user);
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
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.CheckIn, subject: "File" })
    checkInFile(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.fileService.checkinfile(id, user);
    }

    //checkout file
    @Post('checkout-file/:id')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.CheckOut, subject: "File" })
    checkoutFile(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.fileService.checkoutfile(id, user);
    }

    @Delete(':id')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Delete, subject: "File" })
    remove(@Param('id') id: string) {
        return this.fileService.remove(+id);
    }




}
