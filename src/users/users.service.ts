import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)private usersRepository: Repository<User>,
  ) { }
  
    create(arg0: { password: string; id: string; name: string; email: string; createdAt: string; }) {
        throw new Error('Method not implemented.');
    }

  getUserByName(name: string) {
    return this.usersRepository.find({where : {name}});
  }



  
  
  getUsers() {
    return this.usersRepository.find();
  }

  saveUser(user: Omit<User, 'id'>) {
    return this.usersRepository.save(user);
  }

  
  getUserById(id: string) {
    return this.usersRepository.findOne({where : {id}});
}

 getUserByEmail(email: string) {
  return this.usersRepository.findOne({where : {email}});
}
}