const Router = require('express-promise-router');
const router = Router();

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: true});

router.get('/', function(req, res){
    if(typeof(req.session.username) !== 'undefined')
    {
        console.log(req.session.username);
        delete req.session.username;
        console.log('Session has been destroyed !' + req.session.username);
        return res.redirect('./?alert=Your account has been logged out!');
    }
    res.redirect('./?alert=Please log in your account!');
});

module.exports = router;