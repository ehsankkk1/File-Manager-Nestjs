import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddFolderDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string
}

export class DeleteFolderDto {
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id: number
}
export class UpdateFolderDto {

    @IsString()
    @IsNotEmpty()
    name: string

}
export class AddUserToFolderDto {
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    folderId: number

    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    userId: number
}