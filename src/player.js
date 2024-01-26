import { createGameBoard } from "./gameboard.js";
function player(player = 'computer'){
    return {
        playerName:player, 
        playerBoard: createGameBoard(),
    };
};