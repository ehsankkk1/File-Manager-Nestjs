import { PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { User, File, Folder } from "@prisma/client";


export enum Action {
    Manage = 'manage', /// do everything basicly.
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
    CheckIn = 'checkIn',
    CheckOut = 'checkOut',
    Add = 'add',
    Remove = 'remove',
}
export type AppSubjects = 'all' | Subjects<{
    'User': User,
    'File': File,
    'Folder': Folder
}>;
export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;
