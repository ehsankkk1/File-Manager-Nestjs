import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { FileAbilityFactory } from "../../abilities/file.ability.factory";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY_KEY, RequiredRule } from "../../abilities/decorator";
import { ForbiddenError } from "@casl/ability";


@Injectable()
export class FileAbilityGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private fileAbilityFactory: FileAbilityFactory,
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
        const fileId = parseInt(request.params.id);

        //checking ability for the folder access
        const ability = await this.fileAbilityFactory.defineFileAbility(user, folderId, fileId);

        // check for every rule and match with ability
        try {
            rules.forEach(function (rule) {
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)}
            );
            return true;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
        }
    }

}
