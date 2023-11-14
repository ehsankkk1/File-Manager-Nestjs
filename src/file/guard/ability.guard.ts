import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AppAbility, CaslAbilityFactory } from "../../casl/casl-ability.factory";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY_KEY, RequiredRule } from "../decorator";
import { ForbiddenError } from "@casl/ability";
import { GetFileByFolderDto } from "src/file/dto";
import { plainToClass } from "class-transformer";


@Injectable()
export class AbilityGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
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
        const ability = await this.caslAbilityFactory.defineFolderAccessAbility(user, dto);

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
