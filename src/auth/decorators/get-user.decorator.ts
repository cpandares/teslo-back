import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";



export const GetUser = createParamDecorator(
    ( data, ctx: ExecutionContextHost )=>{
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        if(!user) return new InternalServerErrorException('User not found in request');

        return ( !data ) ? user : user[data];
    }
   
);

