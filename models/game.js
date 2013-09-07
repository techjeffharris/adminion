/** 
 * 	models/player.js - define the adminion Game Schema
 * 
 */


 var Player = require('./player')
 	, ChatLog = require('./chatLog')
 	, EventLog = require('./eventLog');

var ERR_NO_SEATS 			= 'sorry, but all seats are occupied.'
	, MSG_REGISTERED 		= 'this user has already.'
	, MSG_IS_PLAYER_ONE		= 'the user is player one.'
	, MSG_PLAYER_AUTHETIC	= 'the player is authentic.'
	, MSG_NOT_PLAYER_ONE	= 'connection is not player one.';

// returns that to which an XOR expression would evaluate
function XOR (a,b) {
  return ( a || b ) && !( a && b );
};

// export the Game constructor
module.exports = function (mongoose) {

	// build player schemas
	var PlayerSchema = Player(mongoose)
		, ChatLogSchema = ChatLog(mongoose)
		, EventLogSchema = EventLog(mongoose);

	// define the GameSchema
	var GameSchema = new mongoose.Schema({
		playerOne: 	{ 
			accountID : { 
				type: mongoose.Schema.Types.ObjectId, 
				required: true 
			}
		}
		, registeredPlayers: 	[ PlayerSchema ]
		// , cards: 		{ type: Array, 	default: new Array() 	}
		// , trash: 		{ type: Array, 	default: new Array() 	}
		, config: 		{ 
			// the number of players allowed to join the game, including player 1
			maxPlayers: 	{ type: Number, default: 4, min: 2, max: 8 }
			, toWin: 		{ type: Number, default: 4 }
			, timeLimit: 	{ type: Number, default: 0 }
		}
		, status: 		{ type: String, default: 'lobby' }
		, log: 			{
			chat: 	 		[ ChatLogSchema ]
			, event: 		[ EventLogSchema ]
			, start: 		{ type: Date, 	default: new Date() 	}
			, deal: 		{ type: Date }
			, end: 			{ type: Date }
		}
	});

	GameSchema.method({

		allReady: function () {
			var count = 0;

			// count the players that are ready
			this.registeredPlayers.forEach(function (player) { 
				// if this player is ready
				if (player.ready) {
					// add 1 to the count
					count +=1; 
				}
			});

			// emit the ready event
			if ( count === this.registeredPlayers.length ) {
				return true;
			} else {
				return false;
			}
		},

		openSeats: 	function () {

			// the maximum players minus the number occupied seats
			return  this.config.maxPlayers - this.registeredPlayers.length;
		},

		playerOneRegistered: function () {

			// return the return value of isRegistered provided playerOne's accountID
			return this.isRegistered( this.playerOne.accountID );
		},

		playersConnected: function () {
			var connected = {};

			var players = this.registeredPlayers.toObject();

			// debug.val('this.registeredPlayers', this.registeredPlayers, 'models/game.js', 89);

			var index = this.isRegistered(this.playerOne.accountID);
			
			// if playerOne is registered
			if ( index !== false ) {
				connected['1'] = players[index];
				players.splice(index,1);
			}

			// debug.val('connected[0]', connected[0], 'models/game.js', 101);

			var i = 2;

			// fill connected with the rest of them in whatever order the js engine feels is nice
			for ( index in players ) {
				connected[String(i)] = players[index];
			};

			debug.val('connected', connected, 'models/game.js', 114);

			return connected;	
		},

		/**
		 *	GameSchema.isPlayerOne(accountID)
		 *
		 * determines whether or not the given socket is playerOne
		 */

		isPlayerOne: function (accountID) {
			debug.val('player vs playerOne', [accountID
				, ''+this.playerOne.accountID], 'models/game.js', 209);

			if (accountID === ''+this.playerOne.accountID) {
				return true;
			} 
			
			debug.msg(MSG_NOT_PLAYER_ONE, 'models/game.js', 218);
			return false;
		},


		/**
		 * GameSchema.isRegistered(accountID)
		 *
		 * determines whether or not the given player has already entered the lobby
		 */
		isRegistered: function (accountID) {
			
			debug.val('this.registeredPlayers', this.registeredPlayers, 'models/game.js', 135);
			debug.val('accountID', accountID, 'models/game.js', 136);
			
			for (var i = 0; i < this.registeredPlayers.length; i += 1) {
				var player = this.registeredPlayers[i];

				debug.msg('index ' + i , 'models/game.js', 143);
				debug.val('player.accountID', player.accountID, 'models/game.js', 144);	

				debug.val('new player', accountID, 'models/game.js', 155);
				debug.val('registered player ' + i, player.accountID, 'models/game.js', 156);

				if (accountID.toString() === player.accountID.toString() ) {
					debug.msg('accountIDs match!', 'models/game.js', 151);
					return i;
				} else {
					debug.msg('accountIDs DO NOT match!', 'models/game.js', 154);
				}
			};

			return false;

		}, 

		startGame: function () {
			debug.msg('eventually, startGame() will start the game... for now it just talks about it.');
			// starting the game includes: 
			//  * set status to inPlay or something
			//  * saving the roster to the database
			//  * instructing sockets to 
		},

		register: function (accountID) {
			
			debug.val('accountID', accountID, 'models/game.js', 169);
			debug.val('this.registeredPlayers', this.registeredPlayers, 'models/game.js', 170);

			debug.msg(accountID + ' is now registered.', 'models/game.js', 163);

			// define the new player
			this.registeredPlayers.addToSet({ accountID: accountID });

			debug.val('this.registeredPlayers', this.registeredPlayers, 'models/game.js', 173);
		
			return this.registeredPlayers.length;
		},

		exitLobby: function (accountID) {

			var index = this.isRegistered(accountID)

			debug.val('index', index, 'models/game.js', 182);

			// if the index matches the return value of this.isRegistered()...
			if ( index !== false ) {
				this.registeredPlayers[index].remove();

				debug.val('this.registeredPlayers', this.registeredPlayers, 'models/game.js', 188);

				return true; 

			} else {

				// not sure who to delete, sorry.
				debug.msg('player not found', 'models/game.js', 195);
				return false;
			}
		}	
	});
	
	// and finally return a model created from GameSchema
	return mongoose.model('Game', GameSchema);
};
