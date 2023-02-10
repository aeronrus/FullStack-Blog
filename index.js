import express from 'express'

import multer from 'multer'

import mongoose from 'mongoose'
import {registerValidation, loginValidation, postCreateValidation} from './validations/validations.js'
import { validationResult } from 'express-validator'  //для проверки на ошибки

import checkAuth from './utils/checkAuth.js'

import {UserController, PostController} from "./controllers/index.js";
import handleValidationErrors from './utils/handleValidationErrors.js'



mongoose.set('strictQuery', true);
mongoose.connect(
  'mongodb+srv://admin:qqqqqq@cluster0.eot3etn.mongodb.net/blog?retryWrites=true&w=majority')
  .then(()=>console.log('DB work'))
  .catch((err)=>console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({                  //создаем хранилище для картинок
  destination: (_, __, cb) =>{
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
}) 

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res)=>{  //если придет гет-запрос на главный адрес(/), то ты должен выполнить функцию, которая сделает: send
  res.send('It`s good work!')
});

app.post('/auth/login', handleValidationErrors, loginValidation, UserController.login)
app.post('/auth/register', handleValidationErrors,registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/posts',  PostController.getAll)
app.get('/posts/:id',  PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation,  PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id',  checkAuth, postCreateValidation, PostController.update)



app.listen(4444, (err)=>{
  if(err){
    return console.log(err)}
    else{
      console.log('Сервер запущен через listen')
    }
  }
)

