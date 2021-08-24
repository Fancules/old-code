import validator from 'express-validator';
import User from '../modules/user.js';

export const regValidator = [
    validator.body('email')
        .isEmail()
        .withMessage('Your email is not correct, please check it and try again!!!')
        .normalizeEmail()
        .trim()
        .custom(async (value) => {
            try{
                const user = await User.findOne({ email : value});
                if (user) {
                    return Promise.reject('This email is already exist!!!');
                }
            }catch(e){
                conole.log(e);
            }
        }),
    validator.body('name', "The field \'name\' must contains at least 3 symbols").isLength({min: 3}).trim(),
    validator.body('password').isAlphanumeric().isLength({min:8}).withMessage("Minimal length is 8 symbols").trim(),
    validator.body('confirm').custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Paswords doesn\'t match');
        }
        return true;
    }),
];

export const loginValidator = [
    validator.body('email').isEmail().trim(),
    validator.body('password').isAlphanumeric().isLength({min: 8})
]

export const listValidator = [
    validator.body('team').isLength({min : 3}).withMessage("Title is too short"),
    validator.body('estDate').isNumeric().isLength({min:4, max:4}).withMessage('It is not a date!'),
    validator.body('img').isURL().withMessage('Incorrect url address')
]