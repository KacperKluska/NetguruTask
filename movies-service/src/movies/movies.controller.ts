import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserMovies(@Req() req): string {
    return this.moviesService.getUserMovies(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async postMovie(@Req() req, @Body() body): Promise<any> {
    return await this.moviesService.postUserMovie(req.user, body.movieTitle);
  }
}
