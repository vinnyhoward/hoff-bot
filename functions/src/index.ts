import * as functions from 'firebase-functions';
import { verifySignature } from './utils';

import { WebClient } from '@slack/web-api';
const bot = new WebClient(functions.config().slack.token);

const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

export const hoffBot = functions.https.onRequest(async (req, res) => {
    console.log('hoffBot - req:', req);
    // Validate Signature
    verifySignature(req); // See snippet above for implementation

    const data = JSON.stringify(req.body);
    const dataBuffer = Buffer.from(data);
    console.log('dataBuffer:', dataBuffer);
    await pubsub.topic('slack-channel-join').publisher().publish(dataBuffer);

    res.sendStatus(200);
});

export const slackChanelJoin = functions.pubsub
    .topic('slack-channel-join')
    .onPublish(async (message: any) => {
        const { event } = message.json;
        const { user, channel } = event;
        const generalChannel = '#general';
        const newChannel = '#random';
        console.log(
            'generalChannel === newChannel:',
            channel !== generalChannel,
        );
        if (channel !== generalChannel) {
            throw Error();
        }

        const userResult: any = await bot.users.profile.get({ user });
        const { display_name } = userResult.profile;
        console.log('userResult:', userResult);
        await bot.channels.invite({
            channel: newChannel,
            user,
        });

        await bot.chat.postMessage({
            channel: newChannel,
            text: `Sup ${display_name}`,
        });
    });
