import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal, LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthGuard } from './guards/auth.guard';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //para aplicar un guard de forma global
 // app.useGlobalGuards(new AuthGuard());
 //para aplicar un interceptor de forma global
  //app.useGlobalInterceptors(new MyInterceptor());
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
