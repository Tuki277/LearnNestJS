import { Injectable, Module, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class GetAccessToken implements NestMiddleware {

  constructor (private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {

    const accessToken = (req.headers.authorization)?.replace(/^Bearer\s/, "")

    if (!accessToken) {
      next()
    }

    const decode = await this.authService.decodeToken(accessToken);
    console.log(decode)

    if (!decode) {
      next();
    } else {
      req.user = decode.id
      console.log("get token")
      next()
    }
  }
}