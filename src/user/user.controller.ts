import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
@Controller('users')
export class UserController {

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        console.log();
        return user;
    }
}
