function diceroll() {
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    //document.getElementById("dice1").innerHTML = dice1;
    //document.getElementById("dice2").innerHTML = dice2;
    alert("You rolled: " + dice1 + " and " + dice2);
   
}
let startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base
var countturn = 0;
function playerturn() {
    var player = 0;
    if (countturn % 2 === 0) {
        alert("Player 1's turn");
        countturn++;
        return player = 1;
    }
    else {       
        alert("Player 2's turn");
        countturn++;
       return player = 2;
    }   

}
function move() {
    var turn = playerturn();
    if (turn === 1) {

    }
    else if (turn === 2) {
       
    }

}
