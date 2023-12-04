import { AbilityBuilder } from "@casl/ability";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { createPrismaAbility } from '@casl/prisma';
import { FolderService } from "src/folder/folder.service";
import { Action, AppAbility } from "./variables";



@Injectable()
export class FolderAbilityFactory {
    constructor(private folderService: FolderService) { }

    async defineFolderAbility(user: User, folderId: number) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (user.isAdmin) {
            can(Action.Manage, "Folder");
            return build();
        }
        cannot(Action.Manage, "Folder");
        can(Action.Create, "Folder");
        can(Action.Read, "Folder");
        
        if(!folderId){
            return build();
        }

        // check if the user is the owner of the folder
        const folderCreator = await this.folderService.checkIfFolderCreator(user.id, folderId);

        if (folderCreator) {
            can(Action.Update, "Folder");
            can(Action.Delete, "Folder");
            can(Action.Add, "Folder");
            can(Action.Remove, "Folder");
        }
        
        return build();
    }
}
