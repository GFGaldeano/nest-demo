import { Controller, Delete, Get, Post, Put, Res, Req, Body, Query, Param, UseGuards, UseInterceptors, ParseUUIDPipe, HttpException, HttpStatus, NotFoundException, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UsePipes} from "@nestjs/common";
import {  Request, Response } from "express";
import { AuthGuard } from "../guards/auth.guard";
import { DateAdderInterceptor } from "../interceptors/date-adder.interceptor";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/CreateUser.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinSizeValidatorPipe } from "../pipes/min-size-validator.pipe";
import { AuthService } from "./auth.service";
import { UserCredentialsDto } from "./dtos/UserCredentials.dto";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../roles.enum";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
//para aplicar el guard a todo el controlador
//@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get()
    getUserByName(@Query('name') name?: string) {
        if (name) {
            return this.usersService.getUserByName(name);
        }
        return this.usersService.getUsers();
    }



    //Leer el profile pero con una autorización
    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    getUserProfile(/*@Headers('token') token?: string*/@Req() request: Request & {user : any}) {
      // if (token !== '1234') {
      //      return 'Sin acceso';
      //  } else {
         console.log(request.user);
            return 'Este endpoint retornará el profile del usuario';
        }  
    

    //ahora implementaremos el guardian en el controlador profile/images
    @ApiBearerAuth()
    @Post('profile/images')
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(MinSizeValidatorPipe)
    //aqui inyectamos el guard
    @UseGuards(AuthGuard)
    async getUserImages(@UploadedFile(
        new ParseFilePipe({
            validators: [
              new MaxFileSizeValidator({
                maxSize: 100000,
                message: 'El archivo debe ser menor a 100kb',
              }),
              new FileTypeValidator({
                fileType: /jpg|jpeg|png|webp$/,
              }),
            ],
          })
    ) file: Express.Multer.File) {
        //return  this.cloudinaryService.uploadImage(file);
        return file;
    }

    //@HttpCode(418)
    @Get('coffee')
    async getCoffee() {
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

    @Get('admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getAdmin(){
        return 'Ruta protegida';
    }

    @Get('auth/protected')
    getAuthProtected(@Req() req: Request) {
      console.log(req.oidc.accessToken);
      return JSON.stringify(req.oidc.user);
    }
    

    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        console.log(id);
        //return this.usersService.getUserById(Number(id));
        const user = await this.usersService.getUserById(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
        createUsers(@Body() user: CreateUserDto, 
        @Req() request: Request & {now: string}) {  
        return this.authService.signUp({...user, createdAt: request.now, isAdmin: false});
    }

    @Post('signin')
    async signIn(@Body() user: UserCredentialsDto) {
        return this.authService.signIn(user.email, user.password);
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

