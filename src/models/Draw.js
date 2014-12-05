var mongoose = require('mongoose');

var DrawModel;

var DrawSchema = new mongoose.Schema({
    xPos: {
        type: Number,
        min: 0,
        required: true
    },

    yPos: {
        type: Number,
        min: 0,
        required: true
    },

    width: {
        type: Number,
        min: 0,
        required: true
    },

    color: {
        type: String,
        default: "#000"
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },

    createdDate: {
        type: Date,
        default: Date.now
    }

});

DrawSchema.methods.toAPI = function() {
    return {
        x: this.xPos,
        y: this.yPos,
        width: this.width
    };
};

DrawSchema.statics.findByOwner = function(ownerId, callback) {

    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };

    return DrawModel.find(search).select("xPos yPos color width").exec(callback);
};

DrawModel = mongoose.model('Draw', DrawSchema);

module.exports.DrawModel = DrawModel;
module.exports.DrawSchema = DrawSchema;
