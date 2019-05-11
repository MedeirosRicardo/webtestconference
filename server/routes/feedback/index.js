var express = require('express');

var router = express.Router();

module.exports = (param) => {

    var {feedbackService} = param;

    router.get('/', async (req, res, next) => {
        try {
            var feedbacklist = await feedbackService.getList();
            return res.render('feedback', {
                page: 'Feedback',
                feedbacklist,
                success: req.query.success,
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            var fbName = req.body.fbName.trim();
            var fbTitle = req.body.fbTitle.trim();
            var fbMessage = req.body.fbMessage.trim();
            var feedbacklist = await feedbackService.getList();
            if(!fbName || !fbTitle || !fbMessage) {
                return res.render('feedback', {
                    page: 'Feedback',
                    error: true,
                    fbName,
                    fbMessage,
                    fbTitle,
                    feedbacklist,
                });
            }
            await feedbackService.addEntry(fbName, fbTitle, fbMessage);
            return res.redirect('/feedback?success=true');
        } catch(err) {
            return next(err);
        }

    });

    return router;
}