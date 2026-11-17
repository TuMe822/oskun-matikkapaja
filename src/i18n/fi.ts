export const fi = {
  appName: 'Oskun Matikkapaja',
  home: {
    oskuSays: 'Hei! Mitä harjoitellaan tänään? Päivän harjoitus on valmiina, tai voit valita itse.',
    daily: 'Päivän harjoitus',
    choose: 'Valitse harjoitus',
  },
  modes: {
    title: 'Mitä harjoitellaan?',
    back: 'Takaisin',
    learn: { name: 'Opi', desc: 'Osku näyttää' },
    practice: { name: 'Harjoittele', desc: 'Yksi kertotaulu' },
    mixed: { name: 'Sekaharjoittelu', desc: 'Taulut sekaisin' },
    challenge: { name: 'Oskun haaste', desc: '10 tai 20 laskua' },
    speed: { name: 'Pikahaaste', desc: 'Montako ehdit?' },
    tricky: { name: 'Vaikeat laskut', desc: 'Sinun vaikeimmat' },
    daily: { name: 'Päivän harjoitus', desc: 'Kertausta ja uutta' },
    mastery: { name: 'Mestarikoe', desc: 'Ilman vihjeitä' },
  },
  options: {
    table: 'Kertotaulu',
    count: 'Laskujen määrä',
    countValue: '{n} laskua',
    time: 'Aika',
    timeValue: '{n} s',
    start: 'Aloita',
  },
  play: {
    tableValue: '{n}:n kertotaulu',
    comingSoon: 'Harjoittelu rakennetaan seuraavaksi. Valintasi:',
    home: 'Etusivulle',
  },
}

export type Messages = typeof fi
