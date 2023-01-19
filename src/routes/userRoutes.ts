import express,{Request, Response, NextFunction} from "express";
import { Login, Register } from "../controllers/userController";


const router = express.Router();


// const setHeaders = (req: Request, res: Response, next: NextFunction) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// };



// router.use('/signup', setHeaders, Register);


router.post("/signup", Register);
router.post("/signin", Login);





export default router;