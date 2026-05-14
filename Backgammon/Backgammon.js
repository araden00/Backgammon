var countturn = 0; //player 1 starts first, even turns for player 1, odd turns for player 2

var startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base

var selectedIndex = -1; // -1 means no piece is selected, otherwise it holds the index of the selected piece on the board

var currentDice = []; // holds the current dice rolls for the turn, can be 2 or 4 numbers depending on if the player rolled doubles or not

var whiteEaten = 0; // כמה לבנים אכולים יש

var blackEaten = 0; // כמה שחורים אכולים יש

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
function resetGame() {
    // החזרת הלוח למצב התחלתי
    startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];

    // איפוס משתנים
    currentDice = [0, 0];
    selectedIndex = -1;
    whiteEaten = 0;
    blackEaten = 0;

    alert("המשחק אותחל מחדש!");

    // קריאה לפונקציית הציור (אם כבר בנית אותה)
    if (typeof updateBoardVisuals === "function") {
        updateBoardVisuals();
    }
}

function move(clickedIndex) {
    if (selectedIndex === -1) {
        if (startpositionboard[clickedIndex] === 0) {
            alert("אין פה חייל!");
            return;
        } else {
            selectedIndex = clickedIndex;
            alert("בחרת חייל במיקום " + clickedIndex + ". לאן להזיז?");
        }
    }
    else {
        var from = selectedIndex;
        var to = clickedIndex;
        var distance = Math.abs(to - from);
        var foundDiceIndex = -1;

        // בדיקת קוביות
        for (var i = 0; i < currentDice.length; i++) {
            if (currentDice[i] === distance && distance !== 0) {
                foundDiceIndex = i;
                break;
            }
        }

        if (foundDiceIndex === -1) {
            alert("אין לך קובייה מתאימה!");
            selectedIndex = -1;
            return;
        }

        var targetValue = startpositionboard[to];

        // --- לוגיקה לשחקן לבן (חיובי) ---
        if (startpositionboard[from] > 0) {
            if (targetValue <= -2) {
                alert("חוסום על ידי השחור!");
                selectedIndex = -1;
                return;
            }
            // בדיקת אכילה: אם יש בדיוק שחור אחד (-1)
            else if (targetValue === -1) {
                alert("אכלת חייל שחור!");
                blackEaten++; // השחור עובר לסל האכולים
                startpositionboard[to] = 1; // הלבן תופס את המשבצת
                startpositionboard[from]--; // יורד חייל מנקודת המוצא
            }
            else {
                startpositionboard[from]--;
                startpositionboard[to]++;
            }
        }
        // --- לוגיקה לשחקן שחור (שלילי) ---
        else {
            if (targetValue >= 2) {
                alert("חסום על ידי הלבן!");
                selectedIndex = -1;
                return;
            }
            // בדיקת אכילה: אם יש בדיוק לבן אחד (1)
            else if (targetValue === 1) {
                alert("אכלת חייל לבן!");
                whiteEaten++; // הלבן עובר לסל האכולים
                startpositionboard[to] = -1; // השחור תופס את המשבצת
                startpositionboard[from]++; // יורד חייל מנקודת המוצא (מוסיפים 1 למספר שלילי)
            }
            else {
                startpositionboard[from]++;
                startpositionboard[to]--;
            }
        }

        currentDice[foundDiceIndex] = 0; // איפס הקובייה המשומשת
        alert("הזזת מ-" + from + " ל-" + to);

        // קריאה לפונקציית הציור (חשוב!)
        if (typeof updateBoardVisuals === "function") {
            updateBoardVisuals();
        }

        selectedIndex = -1;
    }
}

function updateBoardVisuals() {
    for (var i = 0; i < 24; i++) {
        var count = startpositionboard[i];
        var imgElement = document.getElementById("img" + i); // וודא שב-HTML ה-ID הוא img0, img1...

        if (!imgElement) continue; // הגנה למקרה ששכחת ID באחת התמונות

        var direction = (i <= 11) ? "upside" : "";
        var boardColor = (i % 2 === 0) ? "black" : "white";

        if (count > 0) {
            // שים לב למקף (-) שהוספתי לפי הפורמט שלך
            imgElement.src = direction + boardColor + "-" + count + "white.png";
        }
        else if (count < 0) {
            // Math.abs הופך 5- ל-5
            imgElement.src = direction + boardColor + "-" + Math.abs(count) + "black.png";
        }
        else {
            // תמונה ריקה
            imgElement.src = direction + boardColor + ".png";
        }
    }
}
function resetGame() {
    // החזרת הלוח למצב התחלתי
    location.reload(); // פשוט טוען מחדש את הדף כדי לאתחל את כל המשתנים והמצב של המשחק
    alert("המשחק אותחל מחדש!");
}
function score()
{

}
updateBoardVisuals();