const refreshAccessToken = require('../auth/refreshAccessToken');
const mongoose = require('../db');
const axios = require('axios');
const IntraApp = require('../auth/IntraApp');



const userSchema = new mongoose.Schema({
    intraId: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Date, required: true },
    uuid: { type: String, required: true },
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

    const maxUpdatedDate = new Date();
    maxUpdatedDate.setMonth(maxUpdatedDate.getMonth() - 4);
    console.log(this.logtime.lastFetchedDate, maxUpdatedDate, this.logtime.length !== 0 && this.logtime.lastFetchedDate > maxUpdatedDate);
    if (this.logtime.length !== 0 && this.logtime.lastFetchedDate > maxUpdatedDate) {
        console.log('returning from cache');
        return this.logtime.durations;
    }

    try {
        const response = await axios.get(`https://api.intra.42.fr/v2/users/${this.login}/locations_stats`, {
            headers: {
                Authorization: `Bearer ${await IntraApp.getAuthToken()}`
            },
            params: {
                begin_at: new Date(this.logtime.lastFetchedDate).toISOString(),
                end_at: new Date(Date.now()).toISOString()
            }
        });
        console.log('returning from api');
        //console.log(response.data);

        for (const date in response.data) {
            console.log(new Date(date).toISOString());
            const logtime = this.logtime.durations.find((element) => {
                return element.date === new Date(date).toISOString();
                    
            });
            if (logtime) 
                logtime.duration = response.data[date];
            else
                this.logtime.durations.push({date: date, duration: response.data[date]});
        }
      
        // this.logtime.durations = [response.data, ...this.logtime.durations].sort((a, b) => a.date - b.date);
        // this.logtime.lastFetchedDate = new Date(Date.now());
        this.save();
        return this.logtime.durations;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
