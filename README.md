Gekky [BOT]
-----------

Parts:
- Frame - frame.js
- Core - core.js
- Talking parts (Tsundere included) - talk.js
- Command handler - command.js
- Blacklists - blacklist.js
- Friends - friends.js
- Reminders - reminders.js
- Assistant mode - assistant.js
- Sankaku engine, nhentai engine - sankaku.js
- Weather part - weather.js
- Workdayinfo part - workdayinfo.js
- Prime game - primegame.js
- Console I/O - console.js
- Message logging - log.js
- osu irc - osuirc.js

Frame Part - frame.js
---------------------

- a core-t futtató keretrendszer
- újraindítja a botot
- lezárja a botot
- elindítja a botot
- frissíti

Core Part - core.js
-------------------

- console.js inicializálása
- globális változók tárolása
- discord bot eventek kezelése
    - talk.js
    - command.js

Talking parts - talk.js
-----------------------

- állandóan frissülő kód
- tartalmaz minden eddigi választ
- tsundere mód

Command handler - command.js
----------------------------

- ugyanaz a rendszer mint az előzőekben
- TODO-ban minden nem működő parancs
- tsundere switcher, cmdpref changer

Blacklist - blacklist.js
------------------------

- channel és userid alapján
- valósidejű ellenőrzés
- bővíthető lista

Assistant mode - assistant.js
-----------------------------

- későbbi projekt
- ohio rész, reggeli összegző

Weather Part - weather.js
-------------------------

- időjárás információk különböző városokról

Workdayinfo Part - workdayinfo.js
---------------------------------

- munkahelyi időbeosztással kapcsolatos adatok
- indulásig hátralévő idő

Console I/O - console.js
------------------------

- bezárás, újraindítás
- egyenlőre ennyi, későbbiekben globális változók módosítása, üzenetküldés, stb

Message logging - log.js
------------------------

- üzenet logolás konzolra
- színes, parancsok szerinti kiíratás
- logolás fájlba

osu! Irc - osuirc.js
--------------------

- osu chat logolás és üzenés
- online user listázás
- privát üzenetküldés