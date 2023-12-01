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

        // check if the user is the owner of the folder
        const havePermission = await this.folderService.checkFolderPermission(user.id, folderId);

        cannot(Action.Manage, "Folder");

        if (havePermission) {
            can(Action.Read, "Folder");
            can(Action.Create, "Folder");
            can(Action.Update, "Folder");
        }

        // check if there is folder id passed
        if (!folderId) {
            return build();
        }
        // add actions if folder is found
        const getFolderById = await this.folderService.findById(folderId);
        if (getFolderById) {
            // only creator can delete the folder
            if (getFolderById.userId === user.id) {
                can(Action.Delete, "Folder");
            }
        } else {
            throw new ForbiddenException("Folder not found");
        }

        return build();
    }
}
