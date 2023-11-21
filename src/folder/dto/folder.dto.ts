import { IsNotEmpty, IsString } from "class-validator";

export class FolderDto {
    @IsString()
    @IsNotEmpty()
    name: string
}