import { SetMetadata } from "@nestjs/common";
import { Action, AppSubjects } from "../variables";
//import { Subjects } from '@casl/prisma';



export interface RequiredRule {
    action: Action;
    subject: AppSubjects;
}

export const CHECK_ABILITY_KEY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY_KEY, requirements);