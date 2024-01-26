import { ship } from "../src/ship.js";
test.skip('isSunk working', () => {
    const myShip = ship(1);
    expect(myShip.isSunk()).toBe(false);
});
test.skip('isSunk working', () => {
    const myShip = ship(1);
    myShip.hit();
    expect(myShip.isSunk()).toBe(true);
});