import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersDbService } from './usersDB.service';


// const mockUsersService = {
//       getUsers: ()=>'Esto es un servicio mock de usuarios'
//}
//sin mock
// @Module({
//  providers: [UsersService, UsersRepository],
//  controllers: [UsersController],
// })

//con mock
@Module({
      imports:[
            TypeOrmModule.forFeature([User]),
      ],
      providers: [
            //{
      //       provide: UsersService,
      //       useValue: mockUsersService
      // }, 
      UsersService,
      UsersDbService,
      UsersRepository,{
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
      }
 }
