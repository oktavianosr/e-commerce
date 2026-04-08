import express, {type Express, type Request, type Response} from 'express';
import { PORT } from './secrets.js';

const app:Express = express()

app.get('/', (req:Request, res:Response) => {
    res.send('Working')
    
})

app.listen(PORT, () => {
    console.log('App Working!')
})