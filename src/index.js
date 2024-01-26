import { ship } from "./ship.js";
import { createGameBoard } from "./gameboard.js";
import { player } from "./player.js";
function createGrid(parent){
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let j = 0;
    for(let i = 0; i < 121; i ++){
        let gridElement = document.createElement('div');
        if( i < 11){
            gridElement.textContent = letters[i - 1];
            gridElement.classList.add('legendsItems')
        }
        else if(i % 11 === 0){
            gridElement.textContent = i/11;
            gridElement.classList.add('legendsItems')
        }
        else{
            gridElement.id = parent.id[0] + j;
            j++;
            gridElement.classList.add('gridElement');
        }
        parent.appendChild(gridElement);
    };
};
function generateCoords(length) {
    let xIndex, yIndex, orientation;
    do {
        xIndex = Math.floor(Math.random() * 10);
        yIndex = Math.floor(Math.random() * 10);
        orientation = Math.round(Math.random()) === 0 ? 'horizontal' : 'vertical';
    } while (!checkShip(xIndex, yIndex, orientation, length));

    return { xIndex, yIndex, orientation, length };
}
function findIndeces(xRef, yRef, orient, length){
    let neighbours = [];
    let yNum = +yRef * 10;
    if (orient === 'horizontal'){
        for(let i = 0; i < length; i ++){
            neighbours.push(yNum + xRef);
            xRef++ ;
        }; 
    }
    else if (orient === 'vertical'){
        for(let i = 0; i < length; i ++){
            neighbours.push((yRef * 10) + xRef);
            yRef++ ;
        };
    };
    return neighbours;
};
function checkShip(X, Y, orient, length){
    if(orient === 'horizontal'){
        return length + X <= 10;
    }
    else {
        return length + Y <= 10;
    }
}
function generateComputerShips(){
    let indecesList = [];
    let myShips = [];
    let shipLengths = [2, 3, 3, 4, 5];
    for(let i = 0; i < 5; i ++){
        let myShip = generateCoords(shipLengths[i]);
        let neighbours = findIndeces(myShip.xIndex, myShip.yIndex, myShip.orientation, myShip.length);
        indecesList.push(...neighbours);
        myShips.push(ship(myShip.length, myShip.xIndex, myShip.yIndex, myShip.orientation));
    };
    indecesList = indecesList.flat();
    return { indecesList, myShips };
};
function renderShips(array, parent){
    for(let i = 0 ; i < array.length; i++){
        if(array[i] !== 0){
            let gridElement = document.getElementById(parent.id[0] + i);
            gridElement.classList.add('ship');
        };
    };
};

function hasDuplicates(array) {
    for (let i = 0; i < array.length; i++) {
        if (array.indexOf(array[i]) !== i) {
            return false;
        };
    };
    return true; 
};
function isObject(obj){
    return obj === Object(obj);
};
function isGameOver(obj){
    if(obj.hitShips === 5){
        bottomDiv.textContent = '';
        let body = document.querySelector('#bodyDiv');
        let leftDiv = body.querySelector('#leftBodyDiv');
        leftDiv.textContent = '';
        let rightDiv = body.querySelector('#rightBodyDiv');
        rightDiv.textContent = '';
        body.removeChild(leftDiv);
        body.removeChild(rightDiv);
        let announcement = document.createElement('div');
        announcement.textContent = 'Game Over!';
        body.appendChild(announcement);
        let reset = document.createElement('button');
        reset.textContent = 'reset';
        body.appendChild(reset);
        reset.addEventListener('click', function(){
            body.removeChild(reset);
            body.removeChild(announcement);
            body.appendChild(leftDiv);
            body.appendChild(rightDiv);
            gameLoop();
        });
    };
};
function vecinos(index){
    let result = [];
    let newIndex;
     newIndex = index + 1;
     if (newIndex % 10 !== 0) {
         result.push(newIndex);
     }
     newIndex = index - 1;
     if (newIndex % 10 !== 9 && newIndex >= 0) {
         result.push(newIndex);
     }
     newIndex = index + 10;
     if (newIndex < 100) {
         result.push(newIndex);
     }
     newIndex = index - 10;
     if (newIndex >= 0) {
         result.push(newIndex);
     }
     return result;
    };
function intelligentComputer(player, targetedSquares, hitSquares){
    let miVecinos = vecinos(hitSquares[hitSquares.length - 1]);
    for(let i = 0; i < miVecinos.length; i ++){
        if(!targetedSquares.includes(miVecinos[i])){
            return miVecinos[i];
        };
    };
    return null;
}
function playComputerTurn(player, targetedSquares, hitSquares){
    let randomIndex;
    if(hitSquares.length !== 0){
        randomIndex = intelligentComputer(player, targetedSquares, hitSquares);
        if(randomIndex === null){
            do {
                randomIndex = Math.floor(Math.random() * 100);
            } while ( targetedSquares.includes(randomIndex) || player.board[randomIndex] === 'miss');
        };
    }
    else {
        do {
            randomIndex = Math.floor(Math.random() * 100);
        } while ( targetedSquares.includes(randomIndex) || player.board[randomIndex] === 'miss');
    }
    targetedSquares.push(randomIndex);
    if(isObject(player.board[randomIndex])){
        hitSquares.push(randomIndex);
        player.board[randomIndex].hit();
        let gridElement = document.getElementById('l' + randomIndex);
        gridElement.classList.add('hit');
        if(player.board[randomIndex].isSunk()){
            player.hitShips += 1;
            gridElement.textContent = 'X';
            let neighbours = findIndeces(player.board[randomIndex].xRef, player.board[randomIndex].yRef, player.board[randomIndex].orient, player.board[randomIndex].length);
            for(let i = 0; i < neighbours.length; i++){
                let gridElement = document.getElementById('l' + neighbours[i]);
                gridElement.textContent = 'X';
            };
        };
    }
    else if (player.board[randomIndex] === 0){
        let gridElement = document.getElementById('l' + randomIndex);
        gridElement.classList.add('miss');
    };
    isGameOver(player);
};
function placePlayerShips(player) {
    return new Promise((resolve, reject) => {
        let shipLengths = [2, 3, 3, 4, 5];
        let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        let shipIndex = 0; 
        let allIndeces = [];
        let leftDiv = document.querySelector("#leftBodyDiv");
        let shipLengthDisplay = document.createElement('div');
        shipLengthDisplay.id = 'shipLengthDisplay';
        let orientToggle = document.createElement('button');
        orientToggle.textContent = 'horizontal';
        orientToggle.addEventListener('click', function () {
            if (orientToggle.textContent === 'horizontal') {
                orientToggle.textContent = 'vertical';
            } else {
                orientToggle.textContent = 'horizontal';
            }
        });
        let errorDiv = document.createElement('div');
        let bottomDiv = document.querySelector('#bottomDiv');
        let inputsDiv = document.createElement('div');
        inputsDiv.id = 'inputsDiv';
        let xContainer = document.createElement('div');
        xContainer.id = 'xContainer';
        let yContainer = document.createElement('div');
        yContainer.id = 'yContainer';
        let submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Coordinates';
        submitButton.id = 'submitButton';
        let xInput = document.createElement('input');
        xInput.placeholder = 'Main X Coordinate';
        let yInput = document.createElement('input');
        yInput.placeholder = 'Main Y Coordinate';
        let xLabel = document.createElement('div');
        xLabel.textContent = 'Main X Coordinate';
        let yLabel = document.createElement('div');
        yLabel.textContent = 'Main Y Coordinate';

        xContainer.appendChild(xLabel);
        xContainer.appendChild(xInput);
        yContainer.appendChild(yLabel);
        yContainer.appendChild(yInput);
        inputsDiv.appendChild(xContainer);
        inputsDiv.appendChild(orientToggle);
        inputsDiv.appendChild(yContainer);
        bottomDiv.appendChild(shipLengthDisplay);
        bottomDiv.appendChild(inputsDiv);
        bottomDiv.appendChild(submitButton);
        bottomDiv.appendChild(errorDiv);
        function updateShipLengthDisplay() {
            shipLengthDisplay.textContent = `Place ship of length ${shipLengths[shipIndex]}`;
        }
        updateShipLengthDisplay();

        submitButton.addEventListener('click', function () {
            let xCoord = letters.indexOf(xInput.value.toUpperCase());
            let yCoord = parseInt(yInput.value, 10) - 1;
            let neighbours = findIndeces(xCoord, yCoord, orientToggle.textContent, shipLengths[shipIndex]);
            let dupe = false;
            for(let j = 0; j < neighbours.length; j ++){
                if(allIndeces.includes(neighbours[j])){
                    errorDiv.textContent = 'Enter a valid coordinate.';
                    dupe = true;
                };
            };
            if (checkShip(xCoord, yCoord, orientToggle.textContent, shipLengths[shipIndex]) && dupe === false) {
                player.placeShip(shipLengths[shipIndex], xCoord, yCoord, orientToggle.textContent);
                for(let i = 0; i < neighbours.length; i ++){
                    allIndeces.push(neighbours[i]);
                };
                renderShips(player.board, leftDiv);
                xInput.value = '';
                yInput.value = '';
                errorDiv.textContent = '';
                shipIndex++;

                if (shipIndex < shipLengths.length) {
                    updateShipLengthDisplay();
                } else {
                    bottomDiv.removeChild(shipLengthDisplay);
                    bottomDiv.removeChild(inputsDiv);
                    bottomDiv.removeChild(submitButton);
                    bottomDiv.removeChild(errorDiv);
                    let announcement = document.createElement('div');
                    announcement.textContent = 'Begin!';
                    bottomDiv.appendChild(announcement);
                    resolve();
                }
            } else {
                errorDiv.textContent = 'Enter a valid Coordinate';
            }
        });
    });
};

function gameLoop(){
    let dupe = false;
    let theShip;
    while(dupe === false){
        theShip = generateComputerShips();
        dupe = hasDuplicates(theShip.indecesList);
    };
    let leftDiv = document.querySelector('#leftBodyDiv');
    let rightDiv = document.querySelector('#rightBodyDiv')
    createGrid(leftDiv);
    createGrid(rightDiv);
    const player = createGameBoard();
    const computer = createGameBoard();
    for(let i = 0; i < theShip.myShips.length; i++){
        computer.placeShip(theShip.myShips[i].length, theShip.myShips[i].xRef, theShip.myShips[i].yRef, theShip.myShips[i].orient)
    };
    let targetedSquares = [];
    let hitSquares = [];
    placePlayerShips(player).then(() =>{
        renderShips(player.board, leftDiv);
        let rightGridElements = rightDiv.querySelectorAll('.gridElement');
        rightGridElements.forEach(function(element){
            element.addEventListener('click', function(){
                if(element.classList.length === 1){
                    if(isObject(computer.board[element.id.slice(1)])){
                        computer.board[element.id.slice(1)].hit();
                        element.classList.add('hit');
                        if(computer.board[element.id.slice(1)].isSunk()){
                            computer.hitShips += 1;
                            element.textContent = 'X';
                            let neighbours = findIndeces(computer.board[element.id.slice(1)].xRef, computer.board[element.id.slice(1)].yRef, computer.board[element.id.slice(1)].orient, computer.board[element.id.slice(1)].length);
                            for(let i = 0; i < neighbours.length; i++){
                                let gridElement = document.getElementById('r' + neighbours[i]);
                                gridElement.textContent = 'X';
                            };
                            console.log(computer);
                            isGameOver(computer)
                            playComputerTurn(player, targetedSquares, hitSquares);
                            isGameOver(player);
                        };
                        isGameOver(computer);
                        playComputerTurn(player, targetedSquares, hitSquares);
                        isGameOver(player);
                    }
                    else if(computer.board[element.id.slice(1)] === 0){
                        computer.board[element.id.slice(1)] = 'miss';
                        element.classList.add('miss');
                        playComputerTurn(player, targetedSquares, hitSquares);
                        isGameOver(player);
                    };
                };
                isGameOver(computer)
            });
        });
    });
};
gameLoop();
export { findIndeces, generateComputerShips, vecinos };