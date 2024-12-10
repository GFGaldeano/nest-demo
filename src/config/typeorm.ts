import { DataSource, DataSourceOptions } from "typeorm";
import {config as dotenvConfig} from 'dotenv';
import { User } from "src/users/users.entity";
import { Todo } from "src/todos/todos.entity";
import { registerAs } from "@nestjs/config";

dotenvConfig({path: '.env.development'});

const config  = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,// en desarrollo es conveniente tenerlo en true, en producción es mejor tenerlo en false
    logging: true,// para ver las consultas que se hacen a la base de datos
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
}

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions); //cli de orm