import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'El nombre del usuario debe tener como mínimo 3 caracteres',
    example: 'Gustavo',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'El email del usuario debe ser un email válido',
    example: 'gustavo_galdeano@yahoo.com.ar',
  })
  email: string;

/**
 * La contraseña debe ser dificil de adivinar
 * @example Strong!Password123
 */


  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  // @ApiProperty({
  //   description: 'La contraseña debe ser dificil de adivinar',
  //   example: 'Strong!Password123',
  // })
  password: string;

  @IsEmpty()
  @ApiProperty({
    description: 'Asignada por default al crear el usuario, no debe ser incluida en el body',
    default: false,
  })
  IsAdmin: boolean;
}
