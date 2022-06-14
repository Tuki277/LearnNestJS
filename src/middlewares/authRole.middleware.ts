import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { jsonResponse } from "src/helpers";
import { UserDocument } from "src/users/schema/users.schema";
import { UserService } from "src/users/users.service";

@Injectable()
export class AuthRole implements NestMiddleware {

  constructor (private userService: UserService) {}

  async use (req: Request, res: Response, next: NextFunction) {
    const idUser = req.user

    const user: UserDocument = await this.userService.filterQuery({ _id: idUser });

    if (user.Role == 2) {
      next();
    } else {
      return res.status(403).json(jsonResponse(false, "Forbidden"));
    }
  }
}