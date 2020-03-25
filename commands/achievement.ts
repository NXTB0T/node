export const desc = 'achievement <text> - Makes a minecraft achievement'
const talkedRecently = new Set()
import { Message } from 'jackbot-discord'
export const run = (msg: Message, args: string[]) => {
      if (talkedRecently.has(msg.author.id)) {
            return `Please wait 30 seconds before doing that again, ${msg.author}!`
    } else {
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
          talkedRecently.delete(msg.author.id);
        }, 30000);
    }
  if (args.join('')) {
    return {
      files: [{
        attachment: `https://www.minecraftskinstealer.com/achievement/a.php?i=13&h=Achievement+get%21&t=${encodeURIComponent(args.join('+'))}`,
        name: 'mc.png'
      }]
    }
  }
  return 'you need text'
}