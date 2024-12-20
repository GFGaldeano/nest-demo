import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CloudinaryConfig } from '../config/cloudinary';
import { CloudinaryService } from './cloudinary.services';
import { AuthService } from './auth.service';
import { requiresAuth } from 'express-openid-connect';


@Module({
      imports:[
            TypeOrmModule.forFeature([User]),
      ],
      providers: [
    
      UsersService,

      UsersRepository,
      CloudinaryConfig,
      CloudinaryService,
      AuthService,
      {
            provide: 'API_USERS',
            useFactory: async() => {
                  const apiUsers = await fetch('https://jsonplaceholder.typicode.com/users').
                  then(response => response.json());
                  return apiUsers.map(user =>{
                        return {
                              id: user.id,
                              name: user.name,
                              email: user.email
                        }
                  });
            }
      }],
      controllers: [UsersController],
     })

export class UsersModule implements NestModule{
      configure(consumer: MiddlewareConsumer) {
       //consumer.apply(LoggerMiddleware).forRoutes('users');
       consumer.apply(requiresAuth()).forRoutes('users/auth0/portected');
      }
 }
