import { AbilityBuilder, ExtractSubjectType, PureAbility } from "@casl/ability";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { FileEvent, User } from "@prisma/client";
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { FolderService } from "src/folder/folder.service";
import { Action, AppAbility } from "./variables";
import { FileService } from "src/file/file.service";
import { FileEventEnum } from "src/file-event/enum";


@Injectable()
export class FileAbilityFactory {
    constructor(private folderService: FolderService, private fileService: FileService) { }

    async defineFileAbility(user: User, folderId: number, fileId: number) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (user.isAdmin) {
            can(Action.Manage, "File");
            return build();
        }

        // check if user in group (in permission table)
        const havePermission = await this.folderService.checkFolderPermission(user.id, folderId);

        cannot(Action.Manage, "File");

        if (havePermission) {
            can(Action.Read, "File");
            can(Action.Create, "File");
            can(Action.Update, "File");
        }

        // check if there is file id passed
        if (!fileId) {
            return build();
        }

        // add actions if file is found
        const getFileById = await this.fileService.findById(folderId, fileId);
        if (getFileById) {
            // only creator can delete the file
            if (getFileById.userId === user.id) {
                can(Action.Delete, "File");
            }
            // check if file is available 
            if (getFileById.isAvailable) {
                can(Action.CheckIn, "File");
                return build();
            }
            if (!getFileById.isAvailable
                && this.isTheCheckedInUser(user, getFileById.fileEvent)) {
                can(Action.CheckOut, "File");
            }
        } else {
            throw new ForbiddenException("File not found");
        }

        return build();
    }

    isTheCheckedInUser(user: User, events: FileEvent[]) {
        const updatedEvents = events.filter(event => event.eventName === FileEventEnum.CheckIn);

        // Sort updatedEvents by updatedAt in descending order
        updatedEvents.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        // Get the userId of the first event (latest update)
        const lastUpdateUserId = updatedEvents[0]?.userId;
        console.log("Last CheckedIn User ID:", lastUpdateUserId);

        if (lastUpdateUserId === user.id) {
            return true;
        }
        return false;
    }
}
