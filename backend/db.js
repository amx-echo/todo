import {Pool} from 'pg';

const pool = new Pool({
    user: "pgadmin",
    password:"Roin@5236",
    host: "pern-todo-db.postgres.database.azure.com",
    port: 5432,
    database:"postgres"
})

export default pool;