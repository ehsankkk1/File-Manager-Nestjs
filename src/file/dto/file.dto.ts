import { IsNotEmpty, IsString,IsNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';


export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}

export class CheckFileNotEmptyDto {
    @IsNotEmpty()
    @ApiProperty({ required: true, type: 'string', format: 'binary', })
    file: any;
}

export class checkinFilesDto {
    @Type(() => Number)
    @IsNumber({},{each: true})
    filesIds: number[];
}
