import { ship } from "./ship.js";
import { findIndeces } from "./index.js"
function createGameBoard(){
    const gameBoard = {
        hitShips:0,
        misses:0,
        board: [],
        init: function(){
            for(let i = 0; i < 100; i++){
                this.board.push(0);
            };
        },
        placeShip:function(length, xRef, yRef, orient){
            let myShip = ship(length, xRef, yRef, orient);
            let neighbours = findIndeces(xRef, yRef, orient, length);
            for(let i = 0; i < neighbours.length; i++){
                this.board[neighbours[i]] = myShip;
            };
        },
    };
    gameBoard.init();
    return gameBoard;
};
export { createGameBoard };