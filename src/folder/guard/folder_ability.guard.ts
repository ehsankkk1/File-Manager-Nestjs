import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY_KEY, RequiredRule } from "../../abilities/decorator";
import { ForbiddenError } from "@casl/ability";
import { FolderAbilityFactory } from "src/abilities/folder.ability.factory";


@Injectable()
export class FolderAbilityGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private folderAbilityFactory: FolderAbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY_KEY,
                context.getHandler(),
            ) || [];

        // get informations from the request 
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const folderId = parseInt(request.params.folderId);


        //checking ability for the folder access
        const ability = await this.folderAbilityFactory.defineFolderAbility(user, folderId);


        // check for every rule and match with ability
        try {
            rules.forEach((rule) =>
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
            );
            return true;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
        }
    }

}
