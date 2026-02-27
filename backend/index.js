import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import todoRoutes from "./routes/todo.js"

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express();

app.use(cors());
app.use(express.json())


app.use('/todos',todoRoutes)

app.listen(PORT,()=>{
    console.log('Server is listening on port 5000')
})