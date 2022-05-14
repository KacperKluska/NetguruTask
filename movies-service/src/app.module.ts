import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [MoviesModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
