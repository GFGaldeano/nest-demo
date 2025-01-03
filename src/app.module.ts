import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeOrmConfig  from './config/typeorm';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

//import { APP_INTERCEPTOR } from '@nestjs/core';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './guards/auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [TypeOrmConfig],
      }
    ),
    TypeOrmModule.forRootAsync({
     inject:[ConfigService],
     useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),
 UsersModule,
 TodosModule,
 JwtModule.register({
   global: true,
   signOptions: {expiresIn: '1h'},
   secret:process.env.JWT_SECRET,
 }),
],
  controllers: [],
  providers: [
  //   {
  //   provide: 'APP_GUARD',
  //   useClass: AuthGuard,
  // }
  //     {
  //   provide: 'APP_INTERCEPTOR',
  //   useClass: MyInterceptor,
  // }
],
})
export class AppModule {}
