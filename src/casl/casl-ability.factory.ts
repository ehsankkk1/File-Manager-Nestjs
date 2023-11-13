import { AbilityBuilder, ExtractSubjectType, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User, File } from "@prisma/client";
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { FolderService } from "src/folder/folder.service";

export enum Action {
    Manage = 'manage', /// do everything
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}
type AppSubjects = 'all' | Subjects<{
    'User': User,
    'File': File
}>;
type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private folderService: FolderService){}

    async defineAbility(user: User) {
        const {can , cannot , build} = new AbilityBuilder<AppAbility>(createPrismaAbility);

        const havePermission = await this.folderService.checkFolderPermission(user.id,1);

        if(havePermission){
            console.log("Yes I can");
            can(Action.Manage, "User");
        }else{
            console.log("no I can't");
            cannot(Action.Manage, "User");
            cannot(Action.Read, "User");
            cannot(Action.Create, "User");
            cannot(Action.Update, "User");
            cannot(Action.Delete, "User");

        }
        return build();
    }
}
