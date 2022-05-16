import { HttpCode, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { Movie } from '../entities/movie.entity';
import { UserPayload } from '../interfaces/userPayload';
import { MoviesService } from './movies.service';

const basicUser: UserPayload = { userId: 1, name: 'test', role: 'basic' };
const premiumUser: UserPayload = { userId: 2, name: 'test', role: 'basic' };
const noMoviesString = "You don't have any movies posted yet!";
const errorString = 'An error ocurred when tried to get a user movie list.';
const movieTitle = 'Avatar';

jest.mock('axios');

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserMovies', () => {
    it("should return string when user don't have movies", async () => {
      const findResult: Movie[] = [];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);

      expect(await service.getUserMovies(basicUser)).toEqual(noMoviesString);
    });

    it('should return a string when find return undefined', async () => {
      jest.spyOn(Movie, 'find').mockImplementation(() => undefined);

      expect(await service.getUserMovies(basicUser)).toEqual(noMoviesString);
    });

    it('should return a movie when user have a movie', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [newMovie];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);

      expect(await service.getUserMovies(basicUser)).toEqual([newMovie]);
    });

    it('should return a string when error was thrown', async () => {
      jest.spyOn(Movie, 'find').mockImplementation(() => {
        throw Error();
      });

      expect(await service.getUserMovies(basicUser)).toEqual(errorString);
    });
  });

  describe('postUserMovie', () => {
    it('should return string when user is basic and already have 5 movies posted this month', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [
        newMovie,
        newMovie,
        newMovie,
        newMovie,
        newMovie,
      ];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);

      expect(await service.postUserMovie(basicUser, 'avatar')).toEqual(
        'You have already posted 5 movies this month. Get premium to post more movies.',
      );
    });

    it('should return string when user is basic and find throw error', async () => {
      jest.spyOn(Movie, 'find').mockImplementation(async () => {
        throw Error();
      });

      expect(await service.postUserMovie(basicUser, 'avatar')).toEqual(
        'You have already posted 5 movies this month. Get premium to post more movies.',
      );
    });

    it('should return string when axios return status NOT_FOUND', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [newMovie];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);

      (axios.get as jest.Mock).mockImplementation(() => {
        return { status: HttpStatus.NOT_FOUND, data: { Response: 'True' } };
      });

      expect(await service.postUserMovie(premiumUser, movieTitle)).toEqual(
        `Failed to fetch additional data for "${movieTitle}"`,
      );
    });

    it('should return string when axios return Response "False"', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [newMovie];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);

      (axios.get as jest.Mock).mockImplementation(() => {
        return { status: HttpStatus.OK, data: { Response: 'False' } };
      });

      expect(await service.postUserMovie(premiumUser, movieTitle)).toEqual(
        `Failed to fetch additional data for "${movieTitle}"`,
      );
    });

    it('should return string when trying to post a duplicate', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [newMovie];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);
      jest.spyOn(Movie, 'findOne').mockImplementation(async () => newMovie);

      (axios.get as jest.Mock).mockImplementation(() => {
        return { status: HttpStatus.OK, data: { Response: 'True' } };
      });

      expect(await service.postUserMovie(premiumUser, movieTitle)).toEqual(
        `You have already posted this movie!`,
      );
    });

    it('should return string when save throw error', async () => {
      const newMovie = new Movie('1', new Date(), 'n/a', 'n/a', new Date(), 1);
      const findResult: Movie[] = [newMovie];
      jest.spyOn(Movie, 'find').mockImplementation(async () => findResult);
      jest.spyOn(Movie, 'findOne').mockImplementation(async () => null);
      jest.spyOn(Movie, 'save').mockImplementation(async () => newMovie);

      (axios.get as jest.Mock).mockImplementation(() => {
        return {
          status: HttpStatus.OK,
          data: {
            Response: 'True',
            Title: movieTitle,
            Released: new Date(),
            Genre: 'n/a',
            Director: 'n/a',
          },
        };
      });

      expect(await service.postUserMovie(premiumUser, movieTitle)).toEqual(
        `Movie posted successfully`,
      );
    });
  });
});
