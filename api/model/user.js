const mongoose = require('../db');

const userSchema = new mongoose.Schema({
    intraId: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Date, required: true },
    uuid: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
