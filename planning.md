
Steps

1. Have everyone connect
2. Have everyone type in a word
3. move everyone around 1
4. Have everyone doodle the word
5. move everyone around 1
6. Have everyone write the doodle
7. move everyone around 1
8. back to 4 until back to beginning


API:

    Create a new game()

        Create ID
        Create websocket to join new game
        Send back ID

    Join a new game(gameId)

        Create websocket to join the game

Websocket commands:

    -> Ready for a game(gameId)

    -> Send chosen word

    <- Receive other chosen word

    -> Send doodle

    <- Receive other doodle

    -> Send guess

Other server things:

    When theres no websocket connections left, kill the game

    // DB Tables -----------------

// game
// ----------
// gameCode




// players
// ----------
// name
// id? (however it figures out the device)

// choose_word_turn
// ----------
// player
// word


// turn types

    // CHOOSE_WORD
    // DOODLE_WORD
    // GUESS_DOODLE

// players         1                       2                       3                       4

// turn 1          CHOOSE_WORD  (1)        CHOOSE_WORD  (2)         CHOOSE_WORD  (3)        CHOOSE_WORD  (4)
// turn 2          DOODLE_WORD  (4)        DOODLE_WORD  (1)         DOODLE_WORD  (2)        DOODLE_WORD  (3)
// turn 3          GUESS_DOODLE (3)        GUESS_DOODLE (4)         GUESS_DOODLE (1)        GUESS_DOODLE (2)
// turn 4          DOODLE_WORD  (2)        DOODLE_WORD  (3)         DOODLE_WORD  (4)        DOODLE_WORD  (1)
// turn 5          GUESS_DOODLE (1)        GUESS_DOODLE (2)         GUESS_DOODLE (3)        GUESS_DOODLE (4)





interface Player {
    name: string;
}


class PlayerTurn {
    private player: Player;
    constructor(player: string) {
        this.player = {
            name: player
        };
    }
}

class ChooseWordTurn extends PlayerTurn {
    private word: string;
    constructor(player: string, word:string) {
        super(player);
        this.word = word;
    }
}

class GuessDoodleTurn extends PlayerTurn {
    private previousTurn: DoodleWordTurn;
    private guess: string;

    constructor(player: string, previousTurn: DoodleWordTurn, guess: string) {
        super(player)
        this.previousTurn = previousTurn;
        this.guess = guess;
    }
}

class DoodleWordTurn extends PlayerTurn {
    private previousTurn: ChooseWordTurn | GuessDoodleTurn;
    private doodle: string;

    constructor(player: string, previousTurn: ChooseWordTurn | GuessDoodleTurn, doodle: string) {
        super(player);
        this.previousTurn = previousTurn;
        this.doodle = "Doodle<" + doodle + ">";
    }
}

const turn1 = [
    new ChooseWordTurn("p0", "zero"),
    new ChooseWordTurn("p1", "one"),
    new ChooseWordTurn("p2", "two"),
    new ChooseWordTurn("p3", "three"),
];

const turn2 = [
    new DoodleWordTurn("p0", turn1[3], "three"),
    new DoodleWordTurn("p1", turn1[0], "zero"),
    new DoodleWordTurn("p2", turn1[1], "one"),
    new DoodleWordTurn("p3", turn1[2], "two"),
];

const turn3 = [
    new GuessDoodleTurn("p0", turn2[3], "two"),
    new GuessDoodleTurn("p1", turn2[0], "three"),
    new GuessDoodleTurn("p2", turn2[1], "zero"),
    new GuessDoodleTurn("p3", turn2[2], "one"),
];

const turn4 = [
    new DoodleWordTurn("p0", turn3[3], "one"),
    new DoodleWordTurn("p1", turn3[0], "two"),
    new DoodleWordTurn("p2", turn3[1], "three"),
    new DoodleWordTurn("p3", turn3[2], "zero"),
];

const turn5 = [
    new GuessDoodleTurn("p0", turn4[3], "zero"),
    new GuessDoodleTurn("p1", turn4[0], "one"),
    new GuessDoodleTurn("p2", turn4[1], "two"),
    new GuessDoodleTurn("p3", turn4[2], "three"),
];