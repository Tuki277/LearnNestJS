import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { hashPassword, jsonResponse } from "src/helpers";
import { UserService } from "./users.service";

@Controller('api')
export class UsersController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
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

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const checkLogin = await this.userService.validatePassword(req.body.Password, req.body);
    if (!checkLogin) {
      return res.status(200).json(jsonResponse(false, "login fail"));
    }
    const user = await this.userService.filterQuery({ UserName: req.body.UserName })
    const payload = { id: user._id }
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "30d"
    })
    await this.userService.updateUser({ _id: user._id }, {
      ...user,  
      "AccessToken": refreshToken
    }, { new: true })
    return res.status(200).json({
      "result": {
        "error": false,
        "message": "Login success",
        "access_token": this.jwtService.sign(payload),
        "refresh_token": refreshToken
      }
    })
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response ) {
    const refreshToken = req.body.RefreshToken;

    const user = await this.userService.filterQuery({ AccessToken: refreshToken });

    if (!user) {
      return res.status(404).json(jsonResponse(false, "not found"));
    }

    const payload = { id: user._id }
    const refreshTokenCreate = this.jwtService.sign(payload, {
      expiresIn: "30d"
    })

    await this.userService.updateUser({ _id: user._id }, {
      ...user,
      "AccessToken": refreshTokenCreate
    }, { new: true })
    return res.status(200).json({
      "result": {
        "error": false,
        "message": "refresh token",
        "access_token": this.jwtService.sign(payload),
        "refresh_token": refreshTokenCreate
      }
    })
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {;
    const password = await hashPassword(req.body.Password);
    const username = await this.userService.filterQuery({ UserName: req.body.UserName })

    if (username) {
      return res.status(401).json(jsonResponse(false, "Username is duplicated"));
    }
    const userCreate = await this.userService.createUsers({
      ...req.body,
      Password: password
    });

    return res.status(201).json(jsonResponse(false, "created", userCreate));
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