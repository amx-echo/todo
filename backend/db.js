import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    password:process.env.PASSWORD,
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB
})

export default pool;