import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './file.dto';
import { IsString,IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFileDto extends PartialType(CreateFileDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;
}
