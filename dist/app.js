"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const discord_js_1 = require("discord.js");
const watched_courses_1 = require("./utils/watched-courses");
exports.bot = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.Guilds],
});
exports.bot.login(process.env.DISCORD_TOKEN);
exports.bot.on('ready', (discord) => {
    var _a;
    console.log(`Bot started with: ${(_a = exports.bot.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    const channel = discord.channels.cache.get('1220886122914123830');
    node_cron_1.default.schedule('* * * * *', () => main(channel));
});
function fetchAvailability() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Fetching availabilities...');
        const response = yield fetch('https://centralrelacionamento-api.sescsp.org.br/inscricoes-online/cursos?unidades=86&categorias=10009');
        if (!response.ok) {
            throw new Error('Unable to fetch courses.');
        }
        const courses = (yield response.json());
        const filteredCourses = courses.filter((course) => Object.values(watched_courses_1.COURSES).includes(course.turmaId));
        const availableCourses = filteredCourses.filter((course) => course.vagasDisponiveis > 0);
        return availableCourses;
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function main(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            bot.send('test');
            const availableCourses = yield fetchAvailability();
            bot.send('test: ', availableCourses);
            availableCourses.forEach((course) => {
                bot.send(`@here\n\nHá ${course.vagasDisponiveis} ${course.vagasDisponiveis > 1 ? 'vagas disponíveis' : 'vaga disponível'}  para o curso "${course.cursoTitulo}". Corre!!!!!`);
            });
        }
        catch (_a) {
            bot.send('Unable to fetch courses.');
        }
    });
}
