const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        access: String,
        refresh: String,
    },
    accessDevice: String,
    ip: String,
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
});

const SessionModel = mongoose.model("Session", SessionSchema);
module.exports = SessionModel;
