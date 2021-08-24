export default function (req, res, next){
    res.render('404', {
        title: "Page is not found"
    });
    next();
}