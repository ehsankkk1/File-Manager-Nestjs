import { IsString } from 'class-validator';

export class CreateFileDto {
    @IsString()
    title: string;

    @IsString()
    link: string;
}
