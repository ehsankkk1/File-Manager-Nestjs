import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddFolderDto {
    @IsString()
    @IsNotEmpty()
    name: string

}
export class DeleteFolderDto {
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id: number
}
export class UpdateFolderDto {
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    name: string

}