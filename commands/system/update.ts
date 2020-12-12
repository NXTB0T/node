import { exec } from "child_process"
import { Message } from 'discord.js'
import { rreaddir } from "../../utils/rreaddir"
import { Bot, CommandObj } from '../../utils/types'
const shell = (str: string) => new Promise((resolve, reject) => {
  exec(str, (err, stdout, stderr) => {
    if (err) reject(stderr)
    resolve(stdout)
  })
})
export async function run (
  this: Bot,
  message: Message
): Promise<void> {
  if (message.author.id === process.env.OWNER) {
    const msg = await message.channel.send({
      embed: {
        author: {
          name: 'trollsmile update'
        },
        title: 'Fetching from Git...'
      }
    })
    try {
      await shell('git fetch origin master')
      msg.edit({
        embed: {
          author: {
            name: 'trollsmile update'
          },
          title: 'Resetting local changes...'
        }
      })
      await shell('git reset --hard origin/master')
      msg.edit({
        embed: {
          author: {
            name: 'trollsmile update'
          },
          title: 'Updating dependencies...'
        }
      })
      await shell('npm i')
      msg.edit({
        embed: {
          author: {
            name: 'trollsmile update'
          },
          title: 'Compiling...'
        }
      })
      await shell('npx tsc')
      msg.edit({
        embed: {
          author: {
            name: 'trollsmile update'
          },
          title: 'Reloading all commands...'
        }
      })
      Object.keys(require.cache).forEach(name => {
        delete require.cache[name]
      })
      this.commands.clear()
      this.aliases.clear()
      const files = await rreaddir('./commands/')
      const entries: [string, CommandObj][] = await Promise.all(
        files // get the file names of every command in the commands folder
          .filter(filename => filename.endsWith('.js')) // only ones with `.js` at the end
          .map(async (file): Promise<[string, CommandObj]> => [
            file.replace('.js', '').replace(/^.*[\\\/]/, ''), // Remove folders from the path and .js, leaving only the command name
            {
              help: 'A command without a description', // this will be overwritten by the real description if it is there
              ...(await import(`../${file}`)), // `run` and `desc`
              path: require.resolve('../' + file) // for stuff like reload
            }
          ]) // convert filenames to commands
      ) as [string, CommandObj][]
      entries.forEach(([name, command]: [string, CommandObj]) => {
        this.commands.set(name, command)
        command.aliases?.forEach(alias => {
          this.aliases.set(alias, name)
        })
      })
      msg.edit({
        embed: {
          color: 'GREEN',
          title: 'Update complete. restart manually you stupid bitch'
        }
      })
    } catch (e) {
      if (typeof e === 'string') {
        msg.edit({
          embed: {
            author: {
              name: 'trollsmile update',
            },
            title: 'Error!',
            description: '```\n' + e + '\n```',
            color: 'RED'
          }
        })
      }
    }
  } else {
    message.reply('You are not the bot owner.')
  }
}
export const help = 'Updates trollsmile.'