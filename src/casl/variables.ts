import { PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { User, File } from "@prisma/client";


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
