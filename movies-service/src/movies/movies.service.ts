import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Movie } from 'src/entities/movie.entity';
import { UserPayload } from 'src/interfaces/userPayload';

const OMDB_API_KEY = 'cdbf1f6a';

@Injectable()
export class MoviesService {
  async getUserMovies(user: UserPayload): Promise<Movie[] | string> {
    let movies;
    try {
      movies = await Movie.find({ where: { userId: user.userId } });
    } catch (err) {
      console.error('An error ocurred:', err);
    }
    if (!movies?.length) return "You don't have any movies posted yet!";
    return movies;
  }

  private async canUserPostMovie(user: UserPayload) {
    const actualMonth = new Date().getMonth();
    try {
      const movies = await Movie.find({
        where: { userId: user.userId },
        order: { created_at: 'DESC' },
        take: 5,
      });

      const filteredMovies = movies.filter((movie) =>
        movie.created_at.getMonth() === actualMonth ? true : false,
      );

      return filteredMovies.length === 5 ? false : true;
    } catch (err) {
      console.error('An error ocurred:', err);
    }
    return false;
  }

  async postUserMovie(user: UserPayload, movieTitle: string) {
    if (user.role === 'basic' && !(await this.canUserPostMovie(user)))
      return 'You have already posted 5 movies this month. Get premium to post more movies.';

    try {
      const result = await axios(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${movieTitle}`,
      );

      if (result.status !== HttpStatus.OK || result.data.Response === 'False') {
        return `Failed to fetch additional data for "${movieTitle}"`;
      }

      const { Title, Released, Genre, Director } = result.data;

      // searching for a duplicate
      const duplicate = await Movie.findOne({
        where: { userId: user.userId, title: Title },
      });
      if (duplicate) return 'You have already posted this movie!';

      // if everything is ok, save a movie to the db
      const movie = new Movie(
        Title,
        Released,
        Genre,
        Director,
        new Date(),
        user.userId,
      );
      Movie.save(movie);
    } catch (err) {
      console.error('An error ocurred:', err);
    }

    return `Movie posted successfully`;
  }
}
