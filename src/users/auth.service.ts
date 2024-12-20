import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
//import bcrypt from 'bcrypt';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles.enum';

@Injectable()
export class AuthService {
  constructor(private readonly usersDbService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: Omit<User,'id'>) {
    const dbUser = await this.usersDbService.getUserByEmail(user.email);
    if (dbUser) {
      throw new BadRequestException('Email already exist');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if(!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }
    return this.usersDbService.saveUser({ ...user, password: hashedPassword });
    //return { message: 'User created successfully' };


  }

  async signIn(email: string, password: string) {
    const dbUser = await this.usersDbService.getUserByEmail(email);
    if (!dbUser) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Password');
    }

    const userPayload = { 
      sub : dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      //isAdmin: dbUser.isAdmin,};
      roles : [dbUser.isAdmin? Role.Admin : Role.User]};

    const token = this.jwtService.sign(userPayload);

    return { message: 'User loggin in successfully', token };
  }
}
