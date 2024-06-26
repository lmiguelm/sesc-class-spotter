import cron from 'node-cron'
import { Client, GatewayIntentBits } from 'discord.js'

import { Turma } from './models/turma'
import { COURSES } from './utils/watched-courses'

export const bot = new Client({
  intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
})

bot.login(process.env.DISCORD_TOKEN)

bot.on('ready', (discord) => {
  console.log(`v1.0.1 Bot started with: ${bot.user?.tag}`)
  const channel = discord.channels.cache.get('1220886122914123830')
  cron.schedule('0 * * * *', () => main(channel!))
})

async function fetchAvailability() {
  console.log('Fetching availabilities...')

  const response = await fetch(
    'https://centralrelacionamento-api.sescsp.org.br/inscricoes-online/cursos?unidades=86&categorias=10009',
  )

  if (!response.ok) {
    throw new Error('Unable to fetch courses.')
  }

  const courses = (await response.json()) as Turma[]

  const filteredCourses = courses.filter((course) =>
    Object.values(COURSES).includes(course.turmaId),
  )

  const availableCourses = filteredCourses.filter(
    (course) => course.vagasDisponiveis > 0,
  )

  return availableCourses
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function main(bot: any) {
  try {
    const availableCourses = await fetchAvailability()

    availableCourses.forEach((course) => {
      bot.send(
        `@here\n\nHá ${course.vagasDisponiveis} ${course.vagasDisponiveis > 1 ? 'vagas disponíveis' : 'vaga disponível'}  para o curso "${course.cursoTitulo}". Corre!!!!!`,
      )
    })
  } catch {
    bot.send('Unable to fetch courses.')
  }
}
