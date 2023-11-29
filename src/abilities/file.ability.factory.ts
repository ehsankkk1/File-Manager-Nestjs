import { AbilityBuilder, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { FolderService } from "src/folder/folder.service";
import { FolderIdQueryDto } from "src/file/dto";
import { Action, AppAbility } from "./variables";


@Injectable()
export class FileAbilityFactory {
    constructor(private folderService: FolderService) { }

    async defineFileAbility(user: User, folderId: number) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        // check if user have permission in permission table
        const havePermission = await this.folderService.checkFolderPermission(user.id, folderId);

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
