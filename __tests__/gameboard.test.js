import { createGameBoard } from "../src/gameboard.js";
test.skip('Game board initializing', () => {
    const theBoard = createGameBoard();
    expect(theBoard.board.length).toBe(10);
});
test.skip('Game board initializing', () => {
    const theBoard = createGameBoard();
    expect(theBoard.board[0].length).toBe(10);
});