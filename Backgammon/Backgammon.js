var countturn = 0; //player 1 starts first, even turns for player 1, odd turns for player 2
var startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base
var selectedIndex = -1; // -1 means no piece is selected, otherwise it holds the index of the selected piece on the board
var currentDice = []; // holds the current dice rolls for the turn, can be 2 or 4 numbers depending on if the player rolled doubles or not
var whiteEaten = 0; // כמה לבנים אכולים יש
var blackEaten = 0; // כמה שחורים אכולים יש
var whiteScore = 0; // כמה נקודות יש לשחקן הלבן
var blackScore = 0; // כמה נקודות יש לשחקן השחור
var currentPlayer=1;// משתנה גלובלי שיחזיק את השחקן הנוכחי (1 או 2), ניתן לעדכן אותו בפונקציה playerturn ולהשתמש בו בפונקציה move כדי לדעת איזה חיילים מותר להזיז
function diceroll()// מגריל שתי קוביות מ1-6 אם נשארו קוביות שלא נוצלו, אל תיתן לגלגל שוב
{   
    var diceRemaining = false;
    for (var i = 0; i < currentDice.length; i++)
    {
        if (currentDice[i] > 0)
        {
            diceRemaining = true;
        }
    }

    if (diceRemaining)
    {
        alert("עליך לנצל את כל הקוביות לפני הגלגול הבא!");
        return;
    }

    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    if (dice1 === dice2)
    {
        currentDice = [dice1, dice1, dice1, dice1];
    } else
    {
        currentDice = [dice1, dice2];
    }

    document.getElementById("dice1").src = "dice_" + dice1 + "-removebg-preview.png";
    document.getElementById("dice2").src = "dice_" + dice2 + "-removebg-preview.png";

    
}
function playerturn()//determine which player's turn it is based on the countturn variable, and alert the player whose turn it is
{
    if (countturn % 2 === 0)
    {
        /*alert("Player 1's turn");*/
        countturn++;
        return 1;
    }
    else
    {
        /*alert("Player 2's turn");*/
        countturn++;
        return 2;
    }

}

function move(clickedIndex) //check turn+piece ownership+eaten pieces+valid move+update board and visuals takes the index of the clicked piece or target square as a parameter
{
    // 1. זיהוי השחקן הנוכחי
    var turnOwner;
    if (countturn % 2 === 0)
    {
        turnOwner = 1;
    } else
    {
        turnOwner = 2;
    }

    // 2. בדיקה: האם לשחקן יש חיילים אכולים?
    if (turnOwner === 1 && whiteEaten > 0)
    {
        reEnterPiece(clickedIndex);
        return;
    }
    if (turnOwner === 2 && blackEaten > 0)
    {
        reEnterPiece(clickedIndex);
        return;
    }

    // --- לוגיקה להוצאת חיילים (Bear Off) ---

    // בדיקה עבור שחקן לבן
    if (turnOwner === 1 && canPlayerBearOffWhite(1) === true)
    {
        if (selectedIndex === clickedIndex && selectedIndex !== -1)
        {
            var from = selectedIndex;
            var requiredDice = 24 - from;
            var diceIdx = -1;

            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] > 0)
                {
                    if (currentDice[i] === requiredDice)
                    {
                        diceIdx = i;
                        break;
                    }
                    if (currentDice[i] > requiredDice)
                    {
                        var pieceBehind = false;
                        for (var j = 18; j < from; j++)
                        {
                            if (startpositionboard[j] > 0)
                            {
                                pieceBehind = true;
                            }
                        }
                        if (pieceBehind === false)
                        {
                            diceIdx = i; break;
                        }
                    }
                }
            }

            if (diceIdx !== -1)
            {
                startpositionboard[from] = startpositionboard[from] - 1;
                currentDice[diceIdx] = 0;
                selectedIndex = -1;
                updateBoardVisuals();
                checkwinner();

                var hasMoreMoves = false;
                for (var d = 0; d < currentDice.length; d++)
                {
                    if (currentDice[d] > 0)
                    {
                        hasMoreMoves = true;
                    }
                }
                if (hasMoreMoves === false)
                {
                    currentPlayer = playerturn();
                }
                return;
            }
        }
    }

    // בדיקה עבור שחקן שחור
    if (turnOwner === 2 && canPlayerBearOffBlack(2) === true)
    {
        if (selectedIndex === clickedIndex && selectedIndex !== -1)
        {
            var from = selectedIndex;
            var requiredDice = from + 1;
            var diceIdx = -1;

            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] > 0) {
                    if (currentDice[i] === requiredDice)
                    {
                        diceIdx = i;
                        break;
                    }
                    if (currentDice[i] > requiredDice)
                    {
                        var pieceBehind = false;
                        for (var j = 5; j > from; j--)
                        {
                            if (startpositionboard[j] < 0)
                            {
                                pieceBehind = true;
                            }
                        }
                        if (pieceBehind === false) { diceIdx = i; break; }
                    }
                }
            }

            if (diceIdx !== -1)
            {
                startpositionboard[from] = startpositionboard[from] + 1;
                currentDice[diceIdx] = 0;
                selectedIndex = -1;
                updateBoardVisuals();
                checkwinner();

                var hasMoreMoves = false;
                for (var d = 0; d < currentDice.length; d++)
                {
                    if (currentDice[d] > 0) {
                        hasMoreMoves = true;
                    }
                }
                if (hasMoreMoves === false) { currentPlayer = playerturn(); }
                return;
            }
        }
    }

    // 3. לוגיקה לתנועה רגילה על הלוח
    if (selectedIndex !== -1 || (turnOwner === 1 && startpositionboard[clickedIndex] > 0) || (turnOwner === 2 && startpositionboard[clickedIndex] < 0)) {

        if (selectedIndex === -1)
        {
            if (startpositionboard[clickedIndex] === 0) {
                return;
            } else
            {
                selectedIndex = clickedIndex;
            }
        }
        else
        {
            var from = selectedIndex;
            var to = clickedIndex;
            var distance = Math.abs(to - from);
            var foundDiceIndex = -1;

            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] === distance && distance !== 0) {
                    foundDiceIndex = i;
                    break;
                }
            }

            if (foundDiceIndex === -1)
            {
                selectedIndex = -1;
                return;
            }

            var targetValue = startpositionboard[to];

            if (startpositionboard[from] > 0)
            { // לבן
                if (targetValue <= -2)
                {
                    selectedIndex = -1;
                    return;
                } else if (targetValue === -1)
                {
                    blackEaten = blackEaten + 1;
                    startpositionboard[to] = 1;
                    startpositionboard[from] = startpositionboard[from] - 1;
                } else
                {
                    startpositionboard[from] = startpositionboard[from] - 1;
                    startpositionboard[to] = startpositionboard[to] + 1;
                }
            } else { // שחור
                if (targetValue >= 2)
                {
                    selectedIndex = -1;
                    return;
                } else if (targetValue === 1)
                {
                    whiteEaten = whiteEaten + 1;
                    startpositionboard[to] = -1;
                    startpositionboard[from] = startpositionboard[from] + 1;
                } else
                {
                    startpositionboard[from] = startpositionboard[from] + 1;
                    startpositionboard[to] = startpositionboard[to] - 1;
                }
            }

            currentDice[foundDiceIndex] = 0;
            updateBoardVisuals();
            selectedIndex = -1;

            var hasMoreMoves = false;
            for (var j = 0; j < currentDice.length; j++)
            {
                if (currentDice[j] > 0)
                {
                    hasMoreMoves = true;
                    break;
                }
            }

            if (hasMoreMoves === false)
            {
                currentPlayer = playerturn();
            }
        }
    }
}


function updateBoardVisuals()// פונקציה שמעדכנת את התמונות על פי מצב הלוח הנוכחי, יש להפעיל אותה אחרי כל שינוי בלוח עוברת על המארח של הלוח ומדביקה תמונות בהתאם
{
    for (var i = 0; i < 24; i++)
    {
        var count = startpositionboard[i];
        var imgElement = document.getElementById("img" + i); // וודא שב-HTML ה-ID הוא img0, img1...

        if (!imgElement) continue; // הגנה למקרה ששכחת ID באחת התמונות

        var direction = (i <= 11) ? "upside" : "";
        var boardColor = (i % 2 === 0) ? "black" : "white";

        if (count > 0)
        {
            // שים לב למקף (-) שהוספתי לפי הפורמט שלך
            imgElement.src = direction + boardColor + "-" + count + "white.png";
        }
        else if (count < 0)
        {
            // Math.abs הופך 5- ל-5
            imgElement.src = direction + boardColor + "-" + Math.abs(count) + "black.png";
        }
        else
        {
            // תמונה ריקה
            imgElement.src = direction + boardColor + ".png";
        }
    }
}
function resetGame()// פונקציה שמאתחלת את המשחק למצב ההתחלתי, מאפסת את כל המשתנים ומעדכנת את הלוח, ניתן לקרוא לה על ידי כפתור "אתחל משחק"
{
    startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];
    countturn = 0;
    selectedIndex = -1;
    currentDice = [0, 0];
    whiteEaten = 0;
    blackEaten = 0;
    whiteScore = 0;
    blackScore = 0;
    location.reload(); 
    alert("המשחק אותחל מחדש!");
}
function reEnterPiece(clickedIndex)
{
    var turnOwner;
    if (countturn % 2 === 0)
    {
        turnOwner = 1; // לבן
    } else
    {
        turnOwner = 2; // שחור
    }

    var to = clickedIndex;
    var targetValue = startpositionboard[to];
    var distance;

    // חישוב המרחק שהקובייה צריכה לעשות כדי להיכנס
    if (turnOwner === 1)
    {
        // שחקן לבן נכנס למשבצות 0 עד 5
        // אם לחץ על 0, הוא צריך קובייה 1. אם לחץ על 5, הוא צריך קובייה 6.
        distance = to + 1;
    } else {
        // שחקן שחור נכנס למשבצות 23 עד 18
        // אם לחץ על 23, הוא צריך קובייה 1. אם לחץ על 18, הוא צריך קובייה 6.
        distance = 24 - to;
    }

    // בדיקה: האם המשבצת בטווח הכניסה החוקי של השחקן?
    if (turnOwner === 1)
    {
        if (to < 0 || to > 5)
        {
            return; // לבן יכול להיכנס רק ל-0 עד 5
        }
    }
    if (turnOwner === 2)
    {
        if (to < 18 || to > 23)
        {
            return; // שחור יכול להיכנס רק ל-18 עד 23
        }
    }

    // בדיקה: האם יש קובייה שמתאימה בדיוק למרחק הזה?
    var foundDiceIndex = -1;
    for (var i = 0; i < currentDice.length; i++)
    {
        if (currentDice[i] === distance)
        {
            foundDiceIndex = i;
            break;
        }
    }

    // אם לא מצאנו קובייה מתאימה, אי אפשר להיכנס
    if (foundDiceIndex === -1)
    {
        return;
    }

    // בדיקה: האם המשבצת חסומה על ידי היריב?
    if (turnOwner === 1)
    {
        if (targetValue <= -2)
        {
            alert("המשבצת חסומה על ידי השחור!");
            return;
        }
        // כניסה של לבן
        if (targetValue === -1)
        {
            blackEaten = blackEaten + 1; // אכילה
            startpositionboard[to] = 1;
        } else
        {
            startpositionboard[to] = startpositionboard[to] + 1;
        }
        whiteEaten = whiteEaten - 1; // מורידים חייל אחד מהסל של האכולים
    }
    else
    {
        if (targetValue >= 2)
        {
            alert("המשבצת חסומה על ידי הלבן!");
            return;
        }
        // כניסה של שחור
        if (targetValue === 1)
        {
            whiteEaten = whiteEaten + 1; // אכילה
            startpositionboard[to] = -1;
        } else
        {
            startpositionboard[to] = startpositionboard[to] - 1;
        }
        blackEaten = blackEaten - 1; // מורידים חייל מהסל
    }

    // סגירת המהלך
    currentDice[foundDiceIndex] = 0;
    updateBoardVisuals();

    // בדיקה אם נגמרו כל הקוביות בתור
    var movesLeft = false;
    for (var j = 0; j < currentDice.length; j++)
    {
        if (currentDice[j] > 0)
        {
            movesLeft = true;
        }
    }

    if (movesLeft === false) 
    {
        currentPlayer = playerturn();
    }
}
function canPlayerBearOffWhite(player)
{
    if (player === 1 && whiteEaten > 0)
    {
        return false;
    }
    for (var i = 0; i < 24; i++)
    {
        // לשחקן 1 (לבן): מחפשים חייל מחוץ לטווח 18-23
        if (player === 1 && startpositionboard[i] > 0 && i < 18)
        {
            return false;
        }
    }
    return true; // כל החיילים בבית
}
function canPlayerBearOffBlack(player)
{
    // אם יש חייל אכול, אי אפשר להוציא חיילים!
    if (player === 2 && blackEaten > 0)
    {
        return false;
    }
    for (var i = 0; i < 24; i++)
    {
        // לשחקן 2 (שחור): מחפשים חייל מחוץ לטווח 0-5
        if (player === 2 && startpositionboard[i] < 0 && i > 5)
        {
            return false;
        }
    }
    return true; // כל החיילים בבית
}
function checkwinner()
{
    var whiteExists = false;
    var blackExists = false;

    for (var i = 0; i < 24; i++)
    {
        if (startpositionboard[i] > 0) whiteExists = true;
        if (startpositionboard[i] < 0) blackExists = true;
    }

    // אם לבן לא קיים על הלוח ואין לו אכולים (והוא התחיל להוציא)
    if (!whiteExists && whiteEaten === 0)
    {
        alert("White wins!");
        resetGame();
    }
    // אם שחור לא קיים על הלוח ואין לו אכולים
    else if (!blackExists && blackEaten === 0)
    {
        alert("Black wins!");
        resetGame();
    }
}

updateBoardVisuals();
checkwinner();