import { findIndeces, generateComputerShips, vecinos } from "../src/index.js";
test('Test find indeces', () => {
    expect(findIndeces(0, 0, 'horizontal', 3)).toStrictEqual([0, 1, 2]);
});
test('Test generar computer ships', () => {
    expect(generateComputerShips()).toBe('ferda');
});
test.only('Vecinitos', () => {
    expect(vecinos(99)).toBe(6);
});