import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('authService', () => {
    let authService: AuthService;
    let mockUserService : Partial<UsersService> ;
    const mockUser: Omit<User,'id'> = {
        name: 'Gustavo',
        createdAt: '15/09/2024',
        password: '123456',
        email: 'gustavo_galdeano@yahoo.com.ar',
        isAdmin: false,
    }
    beforeEach(async () => {
        mockUserService = {
            getUserByEmail: () => Promise.resolve(undefined),
            saveUser: (user: Omit<User,'id'>) : Promise<User> => Promise.resolve({
                ...user,
                isAdmin: false,
                id:'1234fs-243sd-24csfd-34sdfg',
            }),
           
        };

        const mockJwtService ={
            sign: (payload) => jwt.sign(payload, 'TestSecret')
        }; 

        const module = await Test.createTestingModule({
            providers: [AuthService, {
                provide: JwtService,
                useValue: mockJwtService
            }, {
                provide: UsersService, 
                useValue: mockUserService}],
          }).compile();
        
          authService = module.get<AuthService>(AuthService);
    });

    it('Create an instance of AuthService', async () => {
     expect(authService).toBeDefined();
    });

    it('signUp() create a new user with an encripted password',  async () => {
        const user = await authService.signUp(mockUser);
        expect(user).toBeDefined ();
        expect(user.password).not.toBe(mockUser.password);
    });

    it('signUp() throws an error if the email is already in use', async () => {
        mockUserService.getUserByEmail = (email: string) => 
          Promise.resolve(mockUser as User);
        try {
          await authService.signUp(mockUser as User);
        } catch (error) {
          expect(error.message).toEqual('Email already exist');
        }
      });

      it('signIn() returns an error if the password is invalid', async () => {
        mockUserService.getUserByEmail = (email: string) => 
          Promise.resolve(mockUser as User);
        try {
          await authService.signIn(mockUser.email, 'INVALID PASSWORD');
        } catch (error) {
          expect(error.message).toEqual('Invalid Password');
        }
      });

      it('signIn() returns an error if the user is not found', async () => {
        try {
          await authService.signIn(mockUser.email, mockUser.password);
        } catch (error) {
          expect(error.message).toEqual('User not found');
        }
      });
      
      it('signIn() return an object with a message and a token if the user is found and the password is valid', async () => {
        const mockUserVariant = {
          ...mockUser,
          password: await bcrypt.hash(mockUser.password, 10),
        };
      
        mockUserService.getUserByEmail = (email: string) => 
          Promise.resolve(mockUserVariant as User);
      
        const response = await authService.signIn(
          mockUser.email,
          mockUser.password,
        );
      
        expect(response).toBeDefined();
        expect(response.token).toBeDefined();
        expect(response.message).toEqual('User loggin in successfully');
      });
      
      
});


