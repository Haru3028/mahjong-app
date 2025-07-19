const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.createMany({
    data: [
      { question: '東1局、配牌：123456m 234p 567s 南南。何を切る？', choices: JSON.stringify(['1m', '6m', '南', '2p']), answer: 2, explanation: '役牌の南を切ることで手広くなります。', chapter: '基本' },
      { question: '南2局、配牌：234m 345p 678s 白白白 7m。何を切る？', choices: JSON.stringify(['7m', '白', '2m', '8s']), answer: 0, explanation: '孤立した7mを切るのが最も効率的です。', chapter: '基本' },
      { question: '東3局、配牌：123p 456p 789p 111m 9s。何を切る？', choices: JSON.stringify(['9s', '1m', '3p', '6p']), answer: 0, explanation: '端牌の9sを切って手をまとめます。', chapter: '応用' },
      { question: '南1局、配牌：234s 345s 456s 7p 7p 7p 2m。何を切る？', choices: JSON.stringify(['2m', '7p', '4s', '5s']), answer: 0, explanation: '孤立した2mを切ることで染め手が見えます。', chapter: '応用' },
      { question: '東2局、配牌：111p 222p 333p 444p 5m。何を切る？', choices: JSON.stringify(['5m', '1p', '2p', '3p']), answer: 0, explanation: '雀頭候補の5mを切ってピンズの対子を活かします。', chapter: '基本' },
      { question: '南3局、配牌：345m 678m 123s 456s 9p。何を切る？', choices: JSON.stringify(['9p', '3m', '6m', '1s']), answer: 0, explanation: '孤立した9pを切ることで手広くなります。', chapter: '応用' },
      { question: '東4局、配牌：234p 567p 789p 111s 2m。何を切る？', choices: JSON.stringify(['2m', '1s', '9p', '4p']), answer: 0, explanation: '孤立した2mを切ることでピンズの一通が見えます。', chapter: '応用' },
      { question: '南4局、配牌：123m 456m 789m 111p 9s。何を切る？', choices: JSON.stringify(['9s', '1p', '3m', '6m']), answer: 0, explanation: '端牌の9sを切って手をまとめます。', chapter: '応用' },
      { question: '東2局、配牌：234s 345s 456s 7p 7p 7p 2m。何を切る？', choices: JSON.stringify(['2m', '7p', '4s', '5s']), answer: 0, explanation: '染め手を狙うため孤立した2mを切ります。', chapter: '応用' },
      { question: '南1局、配牌：111m 222m 333m 444m 5p。何を切る？', choices: JSON.stringify(['5p', '1m', '2m', '3m']), answer: 0, explanation: '雀頭候補の5pを切ってマンズの対子を活かします。', chapter: '基本' }
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
