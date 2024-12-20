import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal, LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthGuard } from './guards/auth.guard';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //para aplicar un guard de forma global
 // app.useGlobalGuards(new AuthGuard());
 //para aplicar un interceptor de forma global
  //app.useGlobalInterceptors(new MyInterceptor());
  //app.use(auth(auth0Config));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (errors) => {
      const clearErrors = errors.map(error => {
        return { property: error.property, constraints: error.constraints };
    });
    return  new BadRequestException({
      alert: "Se han detectado errores en la petición y te mmandamos los erroes personalizados",
      errors: clearErrors,
    })
  }}));

  app.use(loggerGlobal);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo NestJS')
    .setDescription('Esta es una API construida con NestJS para ser empleada en las demo del módulo 4 de la especialidad Backend de la carrera Full Stack Developer de Henry')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}



bootstrap();
