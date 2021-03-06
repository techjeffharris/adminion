

# v0.6.0
* each module now exports a factory function which is passed the tools it requires, then return server
* factory functions should only only be used to define variables and functions which use those vars
* all variables in modules should be private and getters/setters defined for those that need to be configurable
* all modules are event emitters with some sort of init function that emits ready event which the main server handles
* cache is an official module to keep things simple, it keeps track of all accounts and games in the database
* sockets are now handled exlusively within the realtime module--it just doesn't make sense anywhere else
* games now expire after 24 Hours; mongodb automatically checks for documents with expiry fields
* app.js now uses cluster module to fork a number of workers either based upon config item or number of CPUs
* db module is now more than just a wrapper for connecting to the databse
* http and realtime are much cleaner now that they get data from cache module which does not require a callback
* removed a lot of redudant code by setting up application parameter middleware to handle :email and :gameID request parameters
* app.js is now master.js, worker.js is the file that runs the worker scripts; this keeps the worker script clean from cluster junk
* and much more i'm sure since I haven't been keeping track... 
* more or less ready to converge with zane

# v0.4.1
* the core logic behind `lib/roster.js` has been incorporated into `models/game.js`
* now when a player enters the lobby, they are added to game.players and the document is saved
* the socket is also added to and removed from `sockets[gameID][playerID]` when entering and exiting lobby
* `Player` model is now `Person` and creates `person` instead of `player`
* routes to `/player*` should now be accessed using `/people*`

# v0.4.0
* `lib/adminion.js` is now `lib/gameServer.js` and has had a MAJOR organizational overhaul.
* integrated socket.io
* when client connects to the lobby, they join the room whose name is the gameId
* created `Roster` constructor in `lib/roster.js` to simplfy coding socket stuff.
* when player enters the game lobby, we pass the socket to roster who checks for funny business and adds them if they're legit.
* working to get a standard error/500 procedure

## v0.3.2
* added breadcrumb support to `view/layout.jade`
* updated `GET /games` to properly display all games by their unique name
* updated `GET /games/create` require entering the player's password twice
* updated `POST /games` to create a game and redirect request to `/games/:gameId`
* updated `GET /games/:gameId` to lookup and pass the requested game to `games/game.jade`
* updated `GET /games/:gameId/join` to allow users to join a game
* updated `GET/POST /register` to GET and POST `/players`
* created `GET /players/:email/update` to display update user info form
* created `POST /players/:email/update` to update the player
* created `GameSchema` probably in v0.3.1, but i'll just say now
* now `GET` and `POST` requests for `/players/create` requrire authorization
* make stats work on `views/players/player.jade`

## v0.3.1
* replacing hard-coded settings with configuration values
 `MongoStore` now uses the existing `mongoose_connection` rather than hard-coded `'adminion'`
* created a bunch of `/games` portals 
* `debug` is now a module with `vars()` and `msg()` to be used as event handlers to optionally ouput debug information to STDOUT
* fixed problem with really short sessions: `session.cookie.maxAge` takes milliseconds not seconds
* ready to start developing UI / migrating `public/scripts/adminion.js` into `lib/realtime.js`
* added `verifyPassword` field to `views/register.jade`
* added `debug` configuration option to `README.md`

### TODO: 
* realtime library will consist of two main properties: 1) game, and 2) chat
* develop API/SOP for Zane to work on Portals and tinker with the vars fed to them 
* have zane play with the game server to find and report bugs while developing
* create script to ensure passwords match when registering

# v0.3.0
* adminion is now an `EventEmitter`.
* db library is now an `EventEmitter`
* sessions work!
* user registration, logon, logoff all work
* routes shall now be referred to as "Portals" because IT magic is cool
* one gameServer will host a variable nubmer games created by users
* created function `logWrapper()` which is optionally set as event handler for adminion "log" event if debug is enabled in the configuration

### Todo
* create `GameSchema`
* define game portals: 
  * `/games`
  * `/games/create`
  * `/games/:game`
  * `/games/:game/join`
  * `/games/:game/lobby`
  * `/games/:game/play`
  * `/games/:game/spectate`
* develop layouts and views
* build library to support user-interface
* port game library to `GameSchema`
* create `CardSchema`
* define card portals:
  * `/cards`
  * `/cards/create`
  * `/cards/import`
  * `/cards/export`
  * `/cards/:card`
  * `/cards/:card/update`
  * `/cards/:card/delete`
  


## v0.2.4
* overhauled `README.md`, now its actually a nice readme 
* zane uploaded graphical card selector
* renamed `https` configuration option to `ssl` is in `config.json` for consistency
* created `CHANGES.md` (see this file)
* renamed `lib/index.js` to `adminion.js`
* created `lib/package.json` to tell node to use `adminion.js` as the library index
* now using `MongoStore` for session storage via `connect-mongo`

## v0.2.3
* no longer tracking `.ssl/` - need to be generated per-machine
* created script to generate key/signed-cert required for https out-of-box
* updated how `lib/config.js` handles `https` configuration option
  * `true` or a filesystem path will enable SSL
  * if `true` the default directory `.ssl/` will be used as prefix
  * otherwise the given path with be used as prefix
* updated `lib/ssl.js` to reflect changes to `lib/config.js`
* updated `config.json` `https` option value to `true` to reflect changes to `lib/config.js`
* updated `package.json` to reflect new version

### Todo
* serve user-interface
* define user-interface
* build library to support user-interface
* port game library to server

## v0.2.2
* https works!
* configuration is now set in `config.json`
* automatic http/https server creation

### Issues / Todo
* `GET /` is resolving to `404` even with route and static `/index.html` file
* finish authentication module
* develop user-interface
* model real-time communication module after UI

## v0.2.1
starting to make a lot more sense. weird ssl error. …

    crypto.js:84
          c.context.setKey(options.key);
                    ^
    Error: error:0906D06C:PEM routines:PEM_read_bio:no start line
        at Object.exports.createCredentials (crypto.js:84:17)
        at Server (tls.js:1062:28)
        at new Server (https.js:34:14)
        at Object.exports.createServer (https.js:49:10)
        at Object.<anonymous> (/home/jeff/git/adminion/app.js:65:7)
        at Module._compile (module.js:449:26)
        at Object.Module._extensions..js (module.js:467:10)
        at Module.load (module.js:356:32)
        at Function.Module._load (module.js:312:12)
        at Module.runMain (module.js:492:10)

## v0.2.0
github:
> This diff is too big to show! We're showing status information only.
> Showing 1,028 changed files with 108,687 additions and 227,919 deletions.
