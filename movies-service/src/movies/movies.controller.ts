import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Movie } from 'src/entities/movie.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserMovies(@Req() req): Promise<Movie[] | string> {
    return this.moviesService.getUserMovies(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async postMovie(@Req() req, @Body() body): Promise<string> {
    return await this.moviesService.postUserMovie(req.user, body.movieTitle);
  }
}
