var express = require('express');
var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser');
var configs = require('./config');
var SpeakerService = require('./services/SpeakerService');
var FeedbackService = require('./services/FeedbackService');
var app = express();

var config = configs[app.get('env')];

var speakerService = new SpeakerService(config.data.speakers);
var feedbackService = new FeedbackService(config.data.feedback);

app.set('view engine', 'pug');
if(app.get('env') === 'development') {
    app.locals.pretty = true;
}
app.set('views', path.join(__dirname, './views'));
app.locals.title = config.sitename;

var routes = require('./routes');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

app.use(async (req, res, next) => {
    try {
        var names = await speakerService.getNames();
        res.locals.speakersNames = names;
        return next();
    } catch(err) {
        return next(err);
    }
});

app.use('/', routes({
    speakerService,
    feedbackService,
}));

app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    var status = err.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    return res.render('error');
});

app.listen(process.env.PORT);

module.export = app;
