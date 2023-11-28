import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CheckFileNotEmptyDto {

    @IsNotEmpty()
    @ApiProperty({required: true,type: 'string', format: 'binary',})
    file: any;

}