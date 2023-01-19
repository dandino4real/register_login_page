import express,{Request, Response} from 'express';
import mongoose from 'mongoose';
import { MongoDB_URL, PORT} from './config'
import userRoute from './routes/userRoutes';
import cors from 'cors'

// Create a new express application instance
const app = express();

//middleware
app.use(express.json());
app.use(cors())


//router middleware
app.use('/users', userRoute);
// app.use('/', (req:Request, res:Response)=>{
//    console.log("Dashboard");
//    res.send("Welcome to Dashboard");
// });


//connect to database
mongoose.set('strictQuery', false)
mongoose.connect(MongoDB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.log("Error connecting to MongoDB", err);
  });
