import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Response, Request } from 'express';

@Controller('api')
export class CatsController {
  constructor(private readonly catService: CatsService) {}

  @Get('cats')
  async getAllCats(@Res() res: Response) {
    let data = await this.catService.getCats();
    return res.status(200).json({
      "result" : {
        "error": false,
        data,
        "message": "Query Success"
      }
    });
  }

  @Post('cats')
  async postCats(@Res() res: Response, @Req() req: Request) {
    let { body } = req;
    let data = await this.catService.createCats({ ...body });
    return res.status(201).json({
      "result": {
        "error": false,
        data,
        "message": "created"
      }
    });
  }

  @Put('cats/:id')
  async updateCat(@Res() res: Response, @Req() req: Request) {
    let id = req.params.id;
    let { body } = req

    let dataSearch = await this.catService.getById({ _id: id });
    if (dataSearch) {
      await this.catService.updateCat({ _id: id }, body, { new: true });
      return res.status(200).json({
        "result": {
          "error": false,
          "message": "updated"
        }
      })
    } else {
      return res.status(404).json({
        "result": {
          "error": "false",
          "message": "Not Found"
        }
      })
    }
  }

  @Delete('cats/:id')
  async deleteCat(@Res() res: Response, @Req() req: Request) {
    let id = req.params.id;

    let dataSearch = await this.catService.getById({ _id: id });
    if (dataSearch) {
      await this.catService.deleteCats(id);
      return res.status(200).json({
        "result": {
          "error": false,
          "message": "deleted"
        }
      })
    } else {
      return res.status(404).json({
        "result": {
          "error": "false",
          "message": "Not Found"
        }
      })
    }
  }
}
