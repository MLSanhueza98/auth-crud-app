import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data, context: ExecutionContext ) => {
        
        const req = context.switchToHttp().getRequest()

        const headers = req.rawHeaders

        return headers
    }
)