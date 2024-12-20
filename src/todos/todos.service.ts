import { Injectable, Inject } from "@nestjs/common";
import { TodosRepository } from "./todos.repository";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()

export class TodosService {
    //sin useValue
    //constructor(private todosRepository: TodosRepository) {
    //con useValue
    constructor(private todosRepository: TodosRepository, @Inject('ACCESS_TOKEN') private accessToken: string,
    @InjectRepository(Todo)
    private todosDBRepository: Repository<Todo>) { }
     
     //sin useValue
    //getTodos() { return this.todosRepository.getTodos(); }
    //con useValue
    // getTodos() { return this.accessToken== 'ESTA ES MI CLAVE SECRETA'? 
    //     this.todosRepository.getTodos(): 'No tiene acceso a esta información'; }

// }
  getTodos() { 
    return this.todosDBRepository.find(
        { relations: ['files'] }
    );
   }

   findById(id: number) {
    return this.todosDBRepository.findOne({where : {id}, relations: ['files'] } );
   }

    create(todo: Omit<Todo, 'id'>) {
     return this.todosDBRepository.save(todo);
    }
}