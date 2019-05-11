var express = require('express');

var router = express.Router();

var speakersRoute = require('./speakers');
var feedbackRoute = require('./feedback');

module.exports = (param) => {

    var { speakerService } = param;

    router.get('/', async (req, res, next) => {
        try {
            var promises = [];
            promises.push(speakerService.getListShort());
            promises.push(speakerService.getAllArtwork());
    
            var results = await Promise.all(promises);
    
            return res.render('index', {
                page: 'Home',
                speakersList: results[0],
                artwork: results[1],
            });
        } catch(err) {
            return next(err);
        }

    });

    router.use('/speakers', speakersRoute(param));
    router.use('/feedback', feedbackRoute(param));

    return router;
}