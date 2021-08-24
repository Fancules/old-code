import express from 'express';
import User from '../modules/user.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid-transport';
import KEY from '../keys/index.js';
import validator from 'express-validator';
import {regValidator as validates} from '../utils/validates.js';

const mailer = nodemailer.createTransport(sendgrid({
    auth: {api_key: KEY.API_KEY_SENDGRID}
}));

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('auth', {
       title: "Login", 
       isLogin: true,
       registerError: req.flash('registerError'),
       loginError: req.flash('loginError'),
       success: req.flash('success')
   }) 
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth');
    });
});

router.get('/reset', (req, res) => {
   res.render('reset', {
       title: "Reset password",
       error: req.flash("error")
   }) 
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        if(!user){
            req.flash('loginError', "User with this email is not found!");
            return res.status(422).redirect('/auth#login');
        }else{
            const isEqual = await bcrypt.compare(req.body.password, user.password);
            if(isEqual){
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if(err){
                        throw err;
                    }
                res.redirect('/');
                });
            }else{
                req.flash('loginError', "Password is wrong!!!");
                return res.status(422).redirect('/auth#login');
            }
        }
    }catch(e){
        console.log(e)
    }
});

router.post('/register', validates, async (req, res) => {
    try{
        const {email, name, password} = req.body;
        const errors = validator.validationResult(req);

        if(!errors.isEmpty()){
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth#register');
        }
        const user = new User({
            email, name, password: await bcrypt.hash(password, 10), cart: {items: []},
        });
        await user.save();

        res.redirect('/auth');

        const msg = {
            to: email,
            from: 'buga.jura@gmail.com',
            subject: "Registration is completed",
            text: 'Congratulation!!! You have successfally registred on this site',
        }

        await mailer.sendMail(msg);
    }catch(e) {
        console.log(e);
    }

});

router.post('/reset', (req, res) => {
    try{
        crypto.randomBytes(32, async (err, buffer) => {
            if(err) {
                req.flash('error', "Something went wrong, please try again!!!")
                res.redirect('/auth/reset');
            }else{
                const token = buffer.toString('hex');
                const candidate = await User.findOne({email:req.body.email});
                const msg = {
                    to: candidate.email,
                    from: 'buga.jura@gmail.com',
                    subject: "Reset password",
                    html: `
                        To continue reset password please follow this 
                        <a href="http://localhost:8080/auth/reset/resetpass/${token}">link</a>
                        `
                } 

                if(candidate){
                    candidate.resetToken = token,
                    candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                    await candidate.save();
                    req.flash('success', 'Please, check your mailbox');
                    res.redirect('/auth');
                    await mailer.sendMail(msg);
                }else{
                    req.flash('error', "Can't find user with this email");
                    res.redirect('/auth/resret')
                }
            }
        });    
    }catch(e){
        console.log(e)
    }
});

router.get('/reset/resetpass/:token', async (req, res) => {
    if(!req.params.token){
        return res.redirect('/auth/reset')
    }

    try{
        const user = await User.findOne({
            resetToken : req.params.token,
            resetTokenExp: {$gt : Date.now()}
        });
        if(user){
            res.render('resetpass', {
                title: 'New password',
                userId: user._id,
                token: req.params.token
            });
        }else{
            return res.redirect('auth/reset')
        }
    }catch(e) {
        console.log(user);
    }    
});

router.post('/reset/resetpass', async (req, res) => {
    try {
        const user = await User.findOne({
            _id : req.body.userId,
            resetToken : req.body.token
        });

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            req.flash('success', "Your password has been changed!");
        } else {
            return res.redirect('/auth');
        }
    }catch(e){
        console.log(e);
    }
    res.redirect('/auth');
});

export default router;