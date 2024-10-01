const mongoose = require('../db');
const { v4: uuidv4 } = require('uuid');


const tokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true, default: uuidv4, unique: true },
	createdAt: { type: Date, default: Date.now , expires: 3600 * 24 * 30},
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
