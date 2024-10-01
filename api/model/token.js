const config = require('../config');
const mongoose = require('../db');
const { v4: uuidv4 } = require('uuid');


const tokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true, default: uuidv4, unique: true, index: true },
	createdAt: { type: Date, default: Date.now , expires: config.tokenDuration, index: true},
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

tokenSchema.methods.getExpirationDate = function() {
	return this.createdAt.getTime() / 1000 + config.tokenDuration;
}

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
