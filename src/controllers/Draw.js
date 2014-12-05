var _ = require('underscore');
var models = require('../models');

var Draw = models.Draw;

var drawPage = function(req, res) {
    Draw.DrawModel.findByOwner(req.session.account._id, function(err, docs) {

        if(err) {
            console.log(err);
            return res.status(400).json({error:'An error occurred'});
        }

        res.render('app', {draws: docs});
    });
};

var draw = function(req, res) {
    var drawData = {
        xPos: req.body.x,
        yPos: req.body.y,
        width: req.body.width,
        color: req.body.color,
        owner: req.session.account._id
    };

    var newBox = new Draw.DrawModel(drawData);

    newBox.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }
        res.json({redirect: '/'});
    });
};

module.exports.drawPage = drawPage;
module.exports.draw = draw;
