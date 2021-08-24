export default function (req, res, next) {
    if(!req.session.isAuthenticated) {
        res.redirect('/auth');
    }
    next();
}