import {body} from 'express-validator'

export const registerValidation=[
  body('email','Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать не меньше 5 символов').isLength({min:5}),
  body('fullName', 'Укажите корректное имя').isLength({min:3}),
  body('avatarUrl', 'Некорректная ссылка на изображение').optional().isURL(),
]


export const loginValidation=[
  body('email','Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать не меньше 5 символов').isLength({min:5}),
]

export const postCreateValidation=[
  body('title','Введите заголовок статьи').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min:5}).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
  body('imageUrl', 'Некорректная ссылка на изображение статьи').optional().isString(),
]