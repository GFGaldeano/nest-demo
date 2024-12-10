import { Injectable } from "@nestjs/common";


@Injectable()
export class TodosRepository{
    private todos = [
        {
          id: 1,
          title: 'Todo 1',
          description: 'Description 1',
          isCompleted: false,
        },
        {
          id: 2,
          title: 'Todo 2',
          description: 'Description 2',
          isCompleted: false,
        },
        {
          id: 3,
          title: 'Todo 3',
          description: 'Description 3',
          isCompleted: true,
        },
        {
          id: 4,
          title: 'Todo 4',
          description: 'Description 4',
          isCompleted: false,
        },
        {
          id: 5,
          title: 'Todo 5',
          description: 'Description 5',
          isCompleted: true,
        },
        {
          id: 6,
          title: 'Todo 6',
          description: 'Description 6',
          isCompleted: false,
        },
        {
          id: 7,
          title: 'Todo 7',
          description: 'Description 7',
          isCompleted: true,
        },
      ];
 
      async getTodos(){
        return this.todos;
      }
}