import { Injectable } from "@nestjs/common";
import { User } from "./user.interface";

@Injectable()
export class UsersRepository{
    private users: User [] = [
        {
          id: 1,
          name: 'Bartolomaiu',
          email: 'barto@gmail.com',
        },
        {
          id: 2,
          name: 'Tota',
          email: 'tota@gmail.com',
        },
        {
          id: 3,
          name: 'Gama',
          email: 'gama@gmail.com',
        },
        {
          id: 4,
          name: 'Lucia',
          email: 'lucia@gmail.com',
        },
        {
          id: 5,
          name: 'Pedro',
          email: 'pedro@gmail.com',
        },
        {
          id: 6,
          name: 'María',
          email: 'maria@gmail.com',
        },
        {
          id: 7,
          name: 'Carlos',
          email: 'carlos@gmail.com',
        },
        {
          id: 8,
          name: 'Ana',
          email: 'ana@gmail.com',
        },
      ];
      
        async getUsers(){
            return this.users;
        }

        async getById(id: number) {
          return this.users.find((user) => user.id == id);
      }
  
      async getByName(name: string) {
          return this.users.find((user) => user.name == name);
      }

      async createUser(user: Omit<User, 'id'>) {
        const id = this.users.length + 1;
        this.users = [...this.users, { id, ...user }];
        return {id, ...user};
    }
    
}