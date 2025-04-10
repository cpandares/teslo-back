import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";



export const GetRawHeader =  createParamDecorator(
    ( data, ctx: ExecutionContextHost )=>{
        const request = ctx.switchToHttp().getRequest();
        const rawHeaders = request.rawHeaders;
        return ( !data ) ? rawHeaders : rawHeaders[data];
    }
);