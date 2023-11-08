/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller({path : 'user'})
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(){
        return this.authService.signup();
    }
    @Post('login')
    login(){
        return this.authService.login();

    }

 }
