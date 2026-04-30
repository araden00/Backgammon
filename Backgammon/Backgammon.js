var countturn = 0;
var startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base
var selectedIndex = -1;
var currentDice = [];

function diceroll() {
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    if (dice1 === dice2) {
        currentDice = [dice1, dice1, dice1, dice1];
       
    } else {
        currentDice = [dice1, dice2];
    }
    document.getElementById("dice1").src = "dice_" + dice1 + "-removebg-preview.png";
    document.getElementById("dice2").src = "dice_" + dice2 + "-removebg-preview.png";
}
function playerturn() {
    if (countturn % 2 === 0) {
        alert("Player 1's turn");
        countturn++;
        return 1;
    }
    else {       
        alert("Player 2's turn");
        countturn++;
       return 2;
    }   

}

function move(clickedIndex) {
    

    if (selectedIndex === -1) {
        
        if (startpositionboard[clickedIndex] === 0) {
            alert("אין פה חייל!");
            return;
        }
        else {
            selectedIndex = clickedIndex;
            alert("בחרת חייל במיקום " + clickedIndex + ". עכשיו תלחץ על לאן להזיז.");
        }
    }

    
    else {
        var from = selectedIndex;
        var to = clickedIndex;
        var distance = Math.abs(to - from);
        var foundDiceIndex = -1;

        for (var i = 0; i < currentDice.length; i++) {
            if (currentDice[i] === distance) {
                foundDiceIndex = i;
                break;
            }
        }

        if (foundDiceIndex === -1) {
            alert("אין לך קובייה מתאימה למהלך הזה!");
            selectedIndex = -1;
            return;
        }

        var targetValue = startpositionboard[to];

        if (startpositionboard[from] > 0)
        {
            if (targetValue <= -2) {
                alert("אי אפשר להזיז לכאן! המשבצת חסומה על ידי השחור.");
                selectedIndex = -1;
                return;
            }
            else {
                startpositionboard[from] = startpositionboard[from] - 1;
                startpositionboard[to] = startpositionboard[to] + 1;
            }
        }
        
        else {
            if (targetValue >= 2) {
                alert("אי אפשר להזיז לכאן! המשבצת חסומה על ידי הלבן.");
                selectedIndex = -1;
                return;
            }
            else {
                startpositionboard[from] = startpositionboard[from] + 1;
                startpositionboard[to] = startpositionboard[to] - 1;
            }
        }
        alert("הזזת מ-" + from + " ל-" + to);
        selectedIndex = -1;
    }
}
