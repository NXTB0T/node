import { Message } from 'jackbot-discord'
const command = (message: Message) => message.channel.send('retard')
export const desc = 'Was made in 45 seconds. Only replies with "retard". That\'s it.'
export const run = command
