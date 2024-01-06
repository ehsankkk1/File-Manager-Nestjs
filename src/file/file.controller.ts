/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Res, Get, Post, Body, Patch, Delete, Param, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, UsePipes, ValidationPipe, ParseFilePipe } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateFileDto, checkinFilesDto } from './dto';
import { CheckAbilities } from 'src/abilities/decorator';
import { FileAbilityGuard } from 'src/file/guard';
import { Action } from 'src/abilities/variables';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { FileValidationUploadInterceptor } from './interceptor/fileValidationUpload.interceptor';
import { UpdateFileDto } from './dto/updateFile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtGuard)
@Controller('folders/:folderId/files/')

export class FileController {
    constructor(private fileService: FileService) { }


    //index (all files in a folder)
    @Get()
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFilesByFolderId(
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.fileService.getAll(folderId);
    }

    // show
    @Get(':id')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Read, subject: "File" })
    async getFileById(
        @Param('id', ParseIntPipe) fileId: number,
    ) {
        return this.fileService.findById(fileId);
    }


    // create
    @Post()
    @UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = uniqueSuffix + ext;
                callback(null, filename);
            }
        }),
    }))
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Create, subject: "File" })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: User,
        @Body() dto: CreateFileDto,
        @Param('folderId', ParseIntPipe) folderId: number
    ) {
        return this.fileService.create(dto, folderId, file.path, user);
    }


    //checkin multiple files
    @Patch('checkin-files')
    @UsePipes(new ValidationPipe({ transform: true }))
    checkInFiles(
        @GetUser() user: User,
        @Body() dto: checkinFilesDto
    ) {
        return this.fileService.checkInFiles(user, dto.filesIds)
    }


    //update
    @Patch(':id')
    //@UseInterceptors(FileValidationUploadInterceptor)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = uniqueSuffix + ext;
                callback(null, filename);
            }
        }),
    }))    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Update, subject: "File" })
    async updateFile(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) fileId: number,
        @Param('folderId', ParseIntPipe) folderId: number,
        @Body() dto: UpdateFileDto,
        @UploadedFile(new ParseFilePipe({
            fileIsRequired: false
        })) file?: Express.Multer.File
    ) {
        return this.fileService.update(fileId, dto, user, file);
    }

    //delete
    @Delete(':id')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.Delete, subject: "File" })
    remove(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.fileService.delete(id, user);
    }

    //checkin file
    @Patch(':id/checkin')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.CheckIn, subject: "File" })
    checkInFile(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.fileService.checkin(id, user);
    }

    //checkout file
    @Patch(':id/checkout')
    @UseGuards(FileAbilityGuard)
    @CheckAbilities({ action: Action.CheckOut, subject: "File" })
    checkoutFile(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.fileService.checkout(id, user);
    }
}
