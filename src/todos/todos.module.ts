import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodosRepository } from './todos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { File } from './files.entity';
import { FilesService } from './files.service';

//sin value
// @Module({
//     providers: [TodosService, TodosRepository],
//     controllers: [TodosController],
// })
//con value
const ACCESS = 'ESTA ES MI CLAVE SECRETA'

@Module({
    imports: [TypeOrmModule.forFeature([Todo, File])],
    providers: [TodosService, FilesService, TodosRepository,{
        provide: 'ACCESS_TOKEN',
        useValue: ACCESS
    }],
    controllers: [TodosController],
})

export class TodosModule{}