# Oskun Matikkapaja 1.0

Kertotaulujen harjoittelusovellus lapsille (suomi ja englanti).
SAMK-ohjelmistokehityskurssin projekti, Tuomas Alanko.

## Kehitys

    npm install
    npm run dev          # http://localhost:5173/matikkapaja/
    npm test             # testit kerran
    npm run test:watch   # testit aina tallennettaessa
    npm run lint
    npm run build

## Julkaisu

Sovellus julkaistaan osoitteeseen https://3lm.fi/matikkapaja/ komennolla:

    bash scripts/deploy.sh             # julkaise nykyinen commit
    bash scripts/deploy.sh --rollback  # palaa edelliseen julkaisuun

Skripti julkaisee vain GitHubissa olevan `main`-haaran commitin ja ajaa ensin samat
tarkistukset kuin CI. Jokainen julkaisu on omassa kansiossaan, ja käytössä oleva
vaihdetaan symlinkillä. Viisi uusinta säilytetään. Käytössä oleva versio näkyy
osoitteessa `/matikkapaja/version.txt`.

Nginx-asetukset ovat tiedostossa `deploy/nginx.conf`. Palvelimelle ne asennetaan näin:

    sudo cp deploy/nginx.conf /etc/nginx/snippets/oskun-matikkapaja.conf
    sudo nginx -t && sudo systemctl reload nginx

Snippetti otetaan käyttöön HTTPS-palvelinlohkon rivillä `include snippets/oskun-matikkapaja.conf;`.

## Käytännöt

- **Kommentit** englanniksi ja lyhyesti: miksi, ei mitä. Laajemmat selitykset tähän tiedostoon.
- **Koodi, testien nimet ja skriptien tulosteet** englanniksi.
- **Sovelluksen tekstit** käännöstiedostoihin suomeksi ja englanniksi, ei suoraan koodiin.
- **Commit-viestit** [Conventional Commits](https://www.conventionalcommits.org/) -muodossa,
  kuvaus suomeksi: `feat: etusivu ja tilan valinta (#11)`. `(#N)` liittää commitin
  issueen, `Closes #N` myös sulkee sen.
- **Yksi commit, yksi asia.** Lint, testit ja build läpi ennen committia.
- **Ei salaisuuksia repoon:** salasanat ja avaimet vain palvelimen ympäristömuuttujiin.

## iPad- ja iPhone-säännöt

Opittu versiosta 0.3.x, jossa nämä aiheuttivat ongelmia kosketuslaitteilla:

1. `touch-action: manipulation` kaikkiin painettaviin elementteihin. Estää
   tuplanapautuksen zoomin, mutta nipistyszoomaus toimii edelleen.
2. Ei `:active`-tilan `transform`- tai `filter`-muutoksia. Safari piirsi painikkeen
   uudelleen kesken napautuksen, ja ensimmäinen painallus katosi.
3. Ei `overflow: hidden` -sääntöä korteissa, joissa on painikkeita, eikä
   `fieldset`-elementtiä painikeryhmissä. Molemmat aiheuttivat saman ongelman.
4. Syöttökentissä vähintään 16 px fontti, muuten iOS zoomaa kenttään.
5. Ei pehmeää vieritystä (smooth scroll) ohjelmallisissa siirroissa.
6. Ei `window.confirm`- tai `prompt`-ikkunoita: oma vahvistusikkuna.
7. Kosketusalueet vähintään 48 px, tabletilla 56 px.

Muutokset testataan oikealla iPadilla ja puhelimella, ei pelkästään selaimen laitenäkymässä.
