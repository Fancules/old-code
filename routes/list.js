import express from 'express';
import listOfTeams from '../modules/add.js';
import validator from 'express-validator';
import { listValidator } from '../utils/validates.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const teams = await listOfTeams.find().populate("userId", "email");

    res.render('list', {
        title: 'List of teams',
        isActive2: true,
        userId: req.user._id.toString(),
        teams
    });
});

router.get('/:id', async (req, res) => {
    const teamInfo = await listOfTeams.findById(req.params.id);

    res.render('team', {
        layout: 'empty',
        title: teamInfo.team,
        teamInfo
    });
});

router.get('/:id/edit', async(req, res) => {
    try{
        const teamInfo = await listOfTeams.findById(req.params.id);
        if(teamInfo.userId.toString() === req.user._id.toString()){
            res.render('edit', {
                title: teamInfo.team + ' edit',
                teamInfo
            })
        }else{
            req.flash('error', 'You don\'t have access');
            res.redirect('/');
        }
    }catch(e){
        console.log(e);
    }
});

router.post('/edit', listValidator, async (req, res) => {
    const id = req.body.id;
    try{
        const errors = validator.validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).redirect(`${id}/edit?allow=true`)
        }
        delete req.body.id;
        await listOfTeams.findByIdAndUpdate(id, req.body);
        res.redirect('/list');
    }catch(e){
        console.log(e);
    }
    
});

router.post('/remove', async (req, res) => {
    await listOfTeams.deleteOne({
        _id: req.body.id
    })
    res.redirect('/list');
});

export default router;
