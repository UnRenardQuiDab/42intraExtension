const refreshAccessToken = require('../auth/refreshAccessToken');
const mongoose = require('../db');
const axios = require('axios');
const IntraApp = require('../auth/IntraApp');


const userSchema = new mongoose.Schema({
    intraId: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiresIn: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    intraUserCreatedAt: { type: Date, required: true },
    logtime: {type: {
        durations : {type :[
            {
                date: { type: Date, required: true },
                duration: { type: String, required: true },
            }
        ]},
        lastFetchedDate: { type: Date, required: true}
    }, default: {durations: []}},
});

userSchema.methods.getToken = async function() {
    if (this.expiresIn >= Date.now()) {
        return this.accessToken;
    }
    refreshAccessToken(this.refreshToken, (error, response) => {
        if (error) {
            console.error(error);
            return null;
        }
        this.accessToken = response.access_token;
        this.expiresIn = new Date(Date.now() + response.expires_in * 1000);
        this.save();
        return this.accessToken;
    });
}

userSchema.methods.getLogtime = async function() {

    const maxUpdatedDate = new Date(Date.now());
    maxUpdatedDate.setMonth(maxUpdatedDate.getMonth() - 4);
    if (this.logtime.length !== 0 && this.logtime.lastFetchedDate > maxUpdatedDate) {
        return this.logtime.durations;
    }

    try {
        const token = await IntraApp.getAuthToken();
        const response = await axios.get(`https://api.intra.42.fr/v2/users/${this.login}/locations_stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                begin_at: new Date(this.logtime.lastFetchedDate).toISOString(),
                end_at: new Date(Date.now()).toISOString()
            }
        });

        for (const date in response.data) {
            const logtime = this.logtime.durations.find((element) => new Date(element.date) === new Date(date));
            if (logtime) 
                logtime.duration = response.data[date];
            else
                this.logtime.durations.push({date: date, duration: response.data[date]});
        }
        this.logtime.lastFetchedDate = new Date(Date.now());
        this.save();
        return this.logtime.durations;
    } catch (error) {
        console.error(error);
        return null;
    }
}


userSchema.statics.findByLogin = async function(login) {
    const user = await this.findOne({ login });
    if (user) {
        return user;
    }
    try {
        const response = await axios.get(`https://api.intra.42.fr/v2/users/${login}`, {
            headers: {
                Authorization: `Bearer ${await IntraApp.getAuthToken()}`
            }
        });

        const { id, created_at } = response.data;

        const user = await this.create({
			intraId: id,
			login: login,
			intraUserCreatedAt: created_at,
			logtime: { durations: [], lastFetchedDate: created_at }
		});
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
