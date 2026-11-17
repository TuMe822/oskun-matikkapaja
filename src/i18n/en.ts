import type { Messages } from './fi'

export const en: Messages = {
  appName: "Osku's Math Workshop",
  home: {
    oskuSays: "Hi! What shall we practise today? Today's practice is ready, or you can choose yourself.",
    daily: "Today's practice",
    choose: 'Choose practice',
  },
  modes: {
    title: 'What shall we practise?',
    back: 'Back',
    learn: { name: 'Learn', desc: 'Osku shows how' },
    practice: { name: 'Practise', desc: 'One table' },
    mixed: { name: 'Mixed practice', desc: 'Tables mixed up' },
    challenge: { name: "Osku's challenge", desc: '10 or 20 sums' },
    speed: { name: 'Speed challenge', desc: 'How many can you do?' },
    tricky: { name: 'Tricky sums', desc: 'Your hardest ones' },
    daily: { name: "Today's practice", desc: 'Review and new' },
    mastery: { name: 'Mastery test', desc: 'No hints' },
  },
  options: {
    table: 'Times table',
    count: 'Number of sums',
    countValue: '{n} sums',
    time: 'Time',
    timeValue: '{n} s',
    start: 'Start',
  },
  play: {
    tableValue: '{n} times table',
    comingSoon: 'Practice is built next. Your choices:',
    home: 'Home',
  },
}
