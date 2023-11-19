/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async signin(dto: AuthDto) {
        // find the user by email
        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

        // if user does not exist throw exception
        if (!user)
            throw new ForbiddenException(
                'Credentials incorrect',
            );

        // compare password
        const pwMatches = await bcrypt.compare(dto.password, user.hash);
        // if password incorrect throw exception
        if (!pwMatches)
            throw new ForbiddenException(
                'Credentials incorrect',
            );
        // Todo return user 
        const token = await this.signToken(user.id, user.email);
        return {
            "userId": user.id,
            "email": user.email,
            "token": token
        };
    }

    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await bcrypt.hash(dto.password, 10);
        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
            // Todo return user 
            const token = await this.signToken(user.id, user.email);
            console.log(token);
            return {
                "userId": user.id,
                "email": user.email,
                "token": token
            };
        } catch (error) {
            if (
                error instanceof
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken',
                    );
                }
            }
            throw error;
        }
    }

    async signToken(userId: number, email: string)
        : Promise<string> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15d',
                secret: secret,
            },
        );
        return token;
    }
}
