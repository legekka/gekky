# Gekky [BOT]

Gekky, a személyes tsundere JavaScript botom. Eléggé szerteágazóvá vált mostanra, és ez csak bővülni fog a továbbiakban. Eredetileg egy egyszerű Discord Bot volt, a magja még mindig ez, de mára már egy megfékezhetetlen programmá vált. Későbbiekben világuralomra fog törni.

## Felépítése
![image of stucture](https://legekka.s-ul.eu/dG3GtlR3.png)

## frame.js
Maga a keretrendszer.

## core.js
Gekky magja, a program bázisa.

## Modulok
- **assistant.js** - személyi asszisztens
- **blacklist.js** - feketelisták
- **command.js** - prefixes parancsok
- **console.js** - alap konzol és a parancsai
- **friends.js** - barátlista (nincs kész)
- **getTime.js** - rendszeridő kérése formázva
- **help.js** - help generátor
- **log.js** - üzenet logolás
- **osuirc.js** - osu IRC kliens
- **osutrack.js** - osu play követő
- **playcard.js** - osu play kártya generátor
- **primegame.js** (nincs kész)
- **reminders.js** - emlékeztetők (nincs kész)
- **reqreload.js** - modulfrissítő
- **sankaku.js** - sankaku motor (nincs teljesen kész)
- **talk.js** - tsundere válaszok
- **updater.js** - kódfrissítő
- **weather.js** - időjárás információk
- **webpconvert.js** - webp-be konvertáló modul
- **workdayinfo.js** - munkaidő információk (nincs teljesen kész)

#Lebontva
## Frame Part - frame.js
- a core-t futtató keretrendszer
- újraindítja a botot
- lezárja a botot
- elindítja a botot
- frissíti

## Core Part - core.js
- console.js inicializálása
- globális változók tárolása
- irc kliens inicializálása
- osutracker inicializálása
- discord bot eventek kezelése
    - talk.js
    - command.js
    - webpconverter.js
    - log.js

## Talking parts - talk.js
- tartalmaz minden eddigi választ (régi gekky)
- tsundere mód

## Command handler - command.js
- időjárás lekérése, help generálása, github link, sok más dolog...
- alapvető vezérlés (IRC, osutracker)

## Blacklist - blacklist.js
- channel- és userid alapján
- valósidejű ellenőrzés
- bővíthető lista

## Assistant mode - assistant.js
- későbbi projekt
- ohio rész, reggeli összegző

## Weather Part - weather.js
- időjárás információk különböző városokról

## Workdayinfo Part - workdayinfo.js
- munkahelyi időbeosztással kapcsolatos adatok
- indulásig hátralévő idő

## Console I/O - console.js
- bezárás, újraindítás
- alapvető modul management (IRC, osutrack vezérlése)

## Message logging - log.js
- üzenet logolás konzolra
- színes, parancsok szerinti kiíratás
- logolás fájlba

## osu! IRC kliens - osuirc.js
- osu chat logolás és üzenés
- online user listázás
- privát üzenetküldés
- afk üzenet

## WebP képkonvertáló - webpconverter.js
- automata képkonverzió
- internetbarát, gyors
- csatolmányok, linkek egyaránt

## osu! score trackelés - osutrack.js
- top20 magyar játékos
- percenkénti frissítés
- részletes információ

## Play kártya generátor - playcard.js
- összes score információ
- egyedi esztétikus design
- kis méret