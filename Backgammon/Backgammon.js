var countturn = 0; //player 1 starts first, even turns for player 1, odd turns for player 2

var startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base

var selectedIndex = -1; // -1 means no piece is selected, otherwise it holds the index of the selected piece on the board

var currentDice = []; // holds the current dice rolls for the turn, can be 2 or 4 numbers depending on if the player rolled doubles or not

function diceroll()//roll two dice, if they are the same, player gets 4 moves with that number, otherwise player gets 2 moves with the numbers on the dice
{ 
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    if (dice1 === dice2)
    {
        currentDice = [dice1, dice1, dice1, dice1];
       
    }
    else
    {
        currentDice = [dice1, dice2];
    }
    document.getElementById("dice1").src = "dice_" + dice1 + "-removebg-preview.png";
    document.getElementById("dice2").src = "dice_" + dice2 + "-removebg-preview.png";
}
function playerturn()//determine which player's turn it is based on the countturn variable, and alert the player whose turn it is
{
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

function move(clickedIndex)// handle the logic for moving a piece on the board when a player clicks on a position. If no piece is currently selected, it will select the piece at the clicked index if it belongs to the current player. If a piece is already selected, it will attempt to move that piece to the clicked index, checking if the move is valid based on the current dice rolls and the state of the board.
{ 

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
        if(currentDice.length==2)
        {
            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] === distance && distance !== 0)
                {
                   foundDiceIndex = i;
                   currentDice[i] = 0; // remove the used dice from the currentDice array
                   break;
                }
            }
        }
        if (foundDiceIndex === -1)
        {
            alert("אין לך קובייה מתאימה למהלך הזה!");
            selectedIndex = -1;
            return;
        }

        var targetValue = startpositionboard[to];

        if (startpositionboard[from] > 0)
        {
            if (targetValue <= -2)
            {
                alert("אי אפשר להזיז לכאן! המשבצת חסומה על ידי השחור.");
                selectedIndex = -1;
                return;
            }
            else
            {
                startpositionboard[from] = startpositionboard[from] - 1;
                startpositionboard[to] = startpositionboard[to] + 1;
            }
        }
        
        else
        {
            if (targetValue >= 2)
            {
                alert("אי אפשר להזיז לכאן! המשבצת חסומה על ידי הלבן.");
                selectedIndex = -1;
                return;
            }
            else
            {
                startpositionboard[from] = startpositionboard[from] + 1;
                startpositionboard[to] = startpositionboard[to] - 1;
            }
        }
        alert("הזזת מ-" + from + " ל-" + to);
        selectedIndex = -1;
    }
}
function drawPieces() {
    var oldPieces = document.querySelectorAll('.pieces-display');
    for (var x = 0; x < oldPieces.length; x++) {
        oldPieces[x].remove();
    }
    // מנקים את כל החיילים הקודמים מהמסך כדי לא ליצור כפילויות
    var oldPieces = document.querySelectorAll('.pieces-display');
    for (var x = 0; x < oldPieces.length; x++) {
        oldPieces[x].remove();
    }

    var allImages = document.getElementsByClassName("lines");

    for (var i = 0; i < allImages.length; i++) {
        var img = allImages[i];
        var onclickAttr = img.getAttribute("onclick");
        var index = parseInt(onclickAttr.match(/\d+/)[0]);

        var count = startpositionboard[index];
        if (count === 0) continue; // אם אין חיילים, מדלגים

        // יוצרים מיכל חדש לחיילים של המשולש הזה
        var display = document.createElement("div");
        display.className = "pieces-display";

        // קובעים את המיקום של המיכל לפי המיקום של התמונה על המסך
        var rect = img.getBoundingClientRect();
        display.style.left = (rect.left + rect.width / 2 - 12) + "px"; // מרכז המשולש

        if (index >= 0 && index <= 11) {
            // שורה עליונה - נתחיל מלמעלה
            display.style.top = (rect.top + 10) + "px";
        } else {
            // שורה תחתונה - נתחיל מלמטה (נשתמש בחישוב הפוך)
            display.style.top = (rect.top + 10) + "px";
            display.style.flexDirection = "column-reverse";
        }

        document.body.appendChild(display);

        // מציירים את החיילים
        var absCount = Math.abs(count);
        var color = (count > 0) ? "white-piece" : "black-piece";

        for (var j = 0; j < absCount; j++) {
            var p = document.createElement("div");
            p.className = "piece " + color;
            display.appendChild(p);
        }
    }
}
window.onload = drawPieces;