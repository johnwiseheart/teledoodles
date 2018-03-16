
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