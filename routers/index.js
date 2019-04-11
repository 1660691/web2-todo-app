const Router = require('express-promise-router');
const router = Router();

router.get('/', function(req, res){
    let username = req.session.username;
    if(typeof(username) !== 'undefined')
        return res.redirect('/todo');
    let alert = req.query.alert;
    let alert1 = req.query.alert1;
    return res.render('index', {alert, alert1});
});

module.exports = router;