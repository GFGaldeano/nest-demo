import { Controller, Delete, Get, HttpCode, Post, Put, Res, Req, Body, Headers, Query, Param, UseGuards, UseInterceptors, ParseUUIDPipe, HttpException, HttpStatus, NotFoundException} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { DateAdderInterceptor } from "src/interceptors/date-adder.interceptor";
import { request } from "http";
import { UsersDbService } from "./usersDB.service";
import { CreateUserDto } from "./dtos/CreateUser.dto";

@Controller('users')
//para aplicar el guard a todo el controlador
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly usersDbService: UsersDbService,
    ) { }

    @Get()
    getUsers() {
        return this.usersDbService.getUsers();
    }

    @Get()
    getUserByName(@Query('name') name?: string) {
        if (name) {
            return this.usersDbService.getUserByName(name);
        }
        return this.usersDbService.getUsers();
    }



    //Leer el profile pero con una autorización
    @Get('profile')
    getUserProfile(@Headers('token') token?: string) {
        if (token !== '1234') {
            return 'Sin acceso';
        } else {
            return 'Este endpoint retornará el profile del usuario';
        }
    }

    //ahora implementaremos el guardian en el controlador profile/images
    @Get('profile/images')
    //aqui inyectamos el guard
   // @UseGuards(AuthGuard)
    getUserImages() {
        return 'Este endpoint retornará las imágenes del usuario';
    }

    //@HttpCode(418)
    @Get('coffee')
    getCoffee() {
      //  return 'Este endpoint retornará el café del usuario';
      try{
       throw new Error();
      }catch(e){
        throw new HttpException({
            status: HttpStatus.I_AM_A_TEAPOT,
            error: 'Envío de cafe fallido',
            }, HttpStatus.I_AM_A_TEAPOT);

      }
    }

    //PARA ACCEDER AL OBJETO RESPONSE DE EXPRESS
    @Get('message')
    getMessage(@Res() response: Response) {
        response.status(200).send('Este es un mensaje');

    }

    @Get('request')
    getRequest(@Req() request: Request) {
        console.log(request);
        return 'Esta ruta logea el request';
    }

    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        console.log(id);
        //return this.usersService.getUserById(Number(id));
        const user = await this.usersDbService.getUserById(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    @Post()
    //para guardar la fecha de creación del usuario usamos el interceptor
    @UseInterceptors(DateAdderInterceptor)
    //createUsers(@Body() user: UserEntity, @Req() request: Request & {now: string}) {
        createUsers(@Body() user: CreateUserDto, @Req() request: Request & {now: string}) {  
    // console.log('dentro del endpoint', request.now);
    console.log({ user }); 
        return this.usersDbService.saveUser({...user, createdAt: request.now});
    }

    @Put()
    updateUser() {
        return 'Este endpoint actualizará un usuario';
    }

    @Delete()
    deleteUser() {
        return 'Este endpoint eliminará un usuario';
    }

}

