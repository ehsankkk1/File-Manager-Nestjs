import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { FileAbilityFactory } from "../../casl/file.ability.factory";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY_KEY, RequiredRule } from "../../casl/decorator";
import { ForbiddenError } from "@casl/ability";
import { GetFileByFolderDto } from "src/file/dto";
import { plainToClass } from "class-transformer";


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
        const dto = plainToClass(GetFileByFolderDto, request.query);

        //checking ability for the folder access
        const ability = await this.fileAbilityFactory.defineFileAbility(user, dto);

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
