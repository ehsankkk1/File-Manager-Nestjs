import { AbilityBuilder, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User, File } from "@prisma/client";
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { FolderService } from "src/folder/folder.service";
import { GetFileByFolderDto } from "src/file/dto";

export enum Action {
    Manage = 'manage', /// do everything basicly.
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
    CheckIn = 'checkIn',
    CheckOut = 'checkOut',
}
export type AppSubjects = 'all' | Subjects<{
    'User': User,
    'File': File
}>;
export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private folderService: FolderService) { }

    async defineFolderAccessAbility(user: User, dto: GetFileByFolderDto) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        // check if user have permission in permission table
        const havePermission = await this.folderService.checkFolderPermission(user.id, dto.folderId);

        if (havePermission) {
            can(Action.Manage, "File");
        } else {
            cannot(Action.Manage, "File");
            cannot(Action.Read, "File");
            cannot(Action.Create, "File");
            cannot(Action.Update, "File");
            cannot(Action.Delete, "File");
            cannot(Action.CheckIn, "File");
            cannot(Action.CheckOut, "File");
        }

        return build();
    }
}
