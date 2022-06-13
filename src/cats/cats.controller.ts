import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Response, Request } from 'express';
import { jsonResponse } from 'src/helpers';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
export class CatsController {
  constructor(private readonly catService: CatsService) {}

  @UseGuards(AuthGuard('auth'))
  @Get('cats')
  async getAllCats(@Res() res: Response) {
    let data = await this.catService.getCats();
    return res.status(200).json(jsonResponse(false, "query success", data))
  }

  @UseGuards(AuthGuard('auth'))
  @Post('cats')
  async postCats(@Res() res: Response, @Req() req: Request) {
    let { body } = req;
    let data = await this.catService.createCats({ ...body });
    return res.status(201).json(jsonResponse(false, "created", data));
  }

  @UseGuards(AuthGuard('auth'))
  @Put('cats/:id')
  async updateCat(@Res() res: Response, @Req() req: Request) {
    let id = req.params.id;
    let { body } = req

    let dataSearch = await this.catService.getById({ _id: id });
    if (dataSearch) {
      await this.catService.updateCat({ _id: id }, body, { new: true });
      return res.status(200).json(jsonResponse(false, "updated"));
    } else {
      return res.status(404).json(jsonResponse(false, "not found"));
    }
  }

  @UseGuards(AuthGuard('auth'))
  @Delete('cats/:id')
  async deleteCat(@Res() res: Response, @Req() req: Request) {
    let id = req.params.id;

    let dataSearch = await this.catService.getById({ _id: id });
    if (dataSearch) {
      await this.catService.deleteCats(id);
      return res.status(200).json(jsonResponse(false, "deleted"));
    } else {
      return res.status(404).json(jsonResponse(false, "not found"));
    }
  }
}
