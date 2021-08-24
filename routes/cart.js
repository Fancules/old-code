import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

function afterUsingMap (cart) {
    return cart.map(elem => ({
        count : elem.count,
        id: elem.teamId._id,
        ...elem.teamId._doc
    }))
}

router.get('/', authMiddleware, async (req, res) => {
    const goods = await req.user.populate('cart.items.teamId').execPopulate();
    const teams = afterUsingMap(goods.cart.items)
    res.render('cart', {
        title: 'Shopping list',
        isActive3: true,
        teams: teams,
        price: 0
    });
});

router.delete('/remove/:id', authMiddleware, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const goods = await req.user.populate('cart.items.teamId').execPopulate();
    const teams = afterUsingMap(goods.cart.items);
    const cart = {
        teams
    }
    res.status(200).json(cart);
});

router.post('/add', authMiddleware, async (req, res) => {
    await req.user.addToCart(req.body.id);
    res.redirect('/cart');
});



export default router;
