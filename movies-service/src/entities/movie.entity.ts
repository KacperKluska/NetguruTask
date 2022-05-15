import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('Movie')
export class Movie extends BaseEntity {
  constructor(
    title: string,
    released: Date,
    genre: string,
    director: string,
    created_at: Date,
    userId: number,
  ) {
    super();
    this.title = title;
    this.released = released;
    this.genre = genre;
    this.director = director;
    this.created_at = created_at;
    this.userId = userId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column()
  released: Date;

  @Column({ length: 255 })
  genre: string;

  @Column({ length: 255 })
  director: string;

  @Column()
  created_at: Date;

  @Column()
  userId: number;
}
