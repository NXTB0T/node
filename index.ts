import { Bot, Commands } from 'jackbot-discord'
import { promises as fs, existsSync } from 'fs'
import live from './modules/livereload'

if (existsSync('./.env')) require('./loadenv') // Before anything uses it, we must load the .env file (provided it exists, of course)

const bot = new Bot({}, {
  prefix: '-',
  allowbots: true
})

if (!process.env.TOKEN) { // if there's no token
  console.error('No token found. Please add it to the env')
  process.exit(1)
} else bot.login(process.env.TOKEN) // login using the token from .env

async function readCommandDir (folder: string): Promise<Commands> {
  return Object.fromEntries( // Object.fromEntries does this: [ ['hello', 2] ] -> { hello: 2 }
    await Promise.all(
      (await fs.readdir(folder)) // get the file names of every command in the commands folder
        .filter(filename => filename.endsWith('.js')) // only ones with `.js` at the end
        .map(filename => filename.replace('.js', '')) // remove `.js` from those
        .map(async file => [file, (await import(folder + file)).run]) // convert filenames to commands
    )
  )
}

bot.on('ready', () => {
  readCommandDir('./commands/').then(bot.add.bind(bot))
})

live(bot, '../commands')
export default bot
