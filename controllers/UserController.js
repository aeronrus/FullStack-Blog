import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/User.js'

export const register=async(req, res)=>{
  try {

const password=req.body.password
const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password, salt)

const doc = new userModel({
    email:req.body.email,
    fullName:req.body.fullName,
    avatarUrl:req.body.avatarUrl,
    passwordHash: hash,
})

const user = await doc.save();

const token = jwt.sign({
  _id:user._id,
}, 'secret123',
{
  expiresIn: '30d'
})

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData, 
    token});
   } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Не удалось зарегистрироваться',
   })
  }
}

export const login =  async(req, res)=>{
  try{
  const user = await userModel.findOne({email:req.body.email});
  if(!user){
    return res.status(404).json({
      message: 'Пользователь не найден'})
  }
  const isValidPas = await bcrypt.compare (req.body.password,
  user._doc.passwordHash);
  if(!isValidPas) {
    return res.status(404).json({
      message:'Логин или пароль не найдeн'
    })
  }
  const token = jwt.sign({
    _id:user._id,
  }, 'secret123',
  {
    expiresIn: '30d'
  })

  const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData, 
    token});

  }
  catch(error){
    console.log(error);
    return res.status(404).json({
      message:'Не удалось авторизоваться'
  })
  }
}


export const getMe = async(req, res)=>{
  try{
    const user = await userModel.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message:'Нет доступа из-за (не смогли расшифровать токен)',
      })
    }

    const {passwordHash, ...userData} = user._doc;

      res.json({userData})
  } 
  catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Нет доступа',
 })
}
}