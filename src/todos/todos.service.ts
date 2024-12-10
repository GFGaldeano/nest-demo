import { Injectable, Inject } from "@nestjs/common";
import { TodosRepository } from "./todos.repository";

@Injectable()

export class TodosService {
    //sin useValue
    //constructor(private todosRepository: TodosRepository) {
    //con useValue
    constructor(private todosRepository: TodosRepository, @Inject('ACCESS_TOKEN') private accessToken: string) {
     }
     //sin useValue
    //getTodos() { return this.todosRepository.getTodos(); }
    //con useValue
    getTodos() { return this.accessToken== 'ESTA ES MI CLAVE SECRETA'? 
        this.todosRepository.getTodos(): 'No tiene acceso a esta información'; }
}