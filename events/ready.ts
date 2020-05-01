import { Bot } from '../utils/types'
import random from '../utils/random'
// Some "Playing" messages from esmBot
import { all } from '../messages'

async function activityChanger (_: void, bot: Bot) {
  // activityChanger from esmBot, also known as "the gamer code"
  bot.user?.setActivity(random(all))
  setTimeout(() => activityChanger(undefined, bot), 900000)
}

export default activityChanger
