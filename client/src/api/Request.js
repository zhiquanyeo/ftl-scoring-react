import api from './socketApi';
import Promise from 'promise';
import PromiseRejectionTracking from 'promise/lib/rejection-tracking';
PromiseRejectionTracking.enable();

const requestMap = {};
let messageId = 1;
const generateMessageId = (channel) => channel + messageId++;

const _request = (channel, body) => {
    if (typeof channel !== 'string' || channel.length === 0) {
        throw new Error(`Invalid message channel: ${channel}`);
    }

    const messageId = generateMessageId(channel);

    api.send('request', messageId, channel, body);

    return new Promise((resolve, reject) => {
        requestMap[messageId] = (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        }
    });
};

api.on('response', (evt, messageId, err, data) => {
    if (!requestMap[messageId]) {
        throw new Error(`No registered request was available for the response with id: ${messageId}`);
    }

    const handler = requestMap[messageId];
    delete requestMap[messageId];
    handler(err, data);
});

const request = (req) => {
    return _request(req.type, req);
}

export default request;