/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Scope } from '@nestjs/common';

@Injectable({})
export class AuthService { 

    login(){
        return {msg : 'login'};
    }
    signup(){
        return {msg : 'signup'};
    }
}
