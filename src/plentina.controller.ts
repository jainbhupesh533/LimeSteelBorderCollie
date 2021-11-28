import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Point } from './models/shape.model';
import { PlentinaService } from './plentina.service';

export interface ShapeDTO {
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
}

export interface CollideShapesRequest {
  firstShape: ShapeDTO;
  secondShape: ShapeDTO;
}

export interface CollideShapesResponse {
  collides: boolean;
  firstShape: ShapeDTO;
  secondShape: ShapeDTO;
}

@Controller()
export class PlentinaController {
  constructor(private readonly plentinaService: PlentinaService) {}

  @Get()
  healthCheck(@Res({ passthrough: true }) res: Response): any {
    try {
      res.status(HttpStatus.OK);
      Logger.log(this.plentinaService.healthCheck());
      return { name: this.plentinaService.healthCheck() };
    } catch (e) {
      Logger.log(e.message);
      res.status(HttpStatus.BAD_REQUEST);
      return { error: 'Did you forget to return your name?' };
    }
  }

  @Post('/shape')
  collideShapes(@Body() req: CollideShapesRequest, @Res() res: Response) {
    try {
      const response: CollideShapesResponse =
        this.plentinaService.doShapesCollide(req);
      res.status(HttpStatus.OK).json(response);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json(e);
    }
  }
}