import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserPayload } from 'src/interfaces/userPayload';

const OMDB_API_KEY = 'cdbf1f6a';

@Injectable()
export class MoviesService {
  getUserMovies(user: UserPayload) {
    return 'Your movies';
  }

  async postUserMovie(user: UserPayload, movieTitle: string) {
    if (user.role === 'basic') {
      // TODO check if basic user can post a movie
    }

    try {
      const result = await axios(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${movieTitle}`,
      );

      if (result.status !== HttpStatus.OK) {
        return 'Failed to fetch additional movie data';
      }

      //   const { Title, Released, Genre, Director } = result.data;
    } catch (err) {
      console.log('An error ocurred:', err);
    }

    //TODO check if movie is already added by user

    return 'Movie posted successfully';
  }
}
