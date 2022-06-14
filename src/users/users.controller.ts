import { Controller, Delete, Get, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { jsonResponse } from "src/helpers";
import { UserService } from "./users.service";

@Controller('api')
export class UsersController {
  constructor(
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard('auth'))
  @Get('users')
  async getAllUsers(@Res() res: Response) {
    let data = await this.userService.getAllUsers();

    return res.status(200).json(jsonResponse(false, "query success", data))
  }

  @UseGuards(AuthGuard('auth'))
  @Get('test')
  async testFuction (@Res() res: Response) {
    return res.status(HttpStatus.OK).json({ "hello": 123})
  }

  @Delete('users/:id')
  async deleteCat(@Res() res: Response, @Req() req: Request) {
    let id = req.params.id;

    let dataSearch = await this.userService.filterQuery({ _id: id });
    if (dataSearch) {
      await this.userService.deleteUsers(id);
      return res.status(200).json(jsonResponse(false, "deleted"));
    } else {
      return res.status(404).json(jsonResponse(false, "not found"));
    }
  }
}