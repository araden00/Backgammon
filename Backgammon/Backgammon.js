var countturn = 0; //player 1 starts first, even turns for player 1, odd turns for player 2
var startpositionboard = [2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2];//1-6 whitbase 18-24 black base
var selectedIndex = -1; // -1 means no piece is selected, otherwise it holds the index of the selected piece on the board
var currentDice = []; // holds the current dice rolls for the turn, can be 2 or 4 numbers depending on if the player rolled doubles or not
var whiteEaten = 0; // כמה לבנים אכולים יש
var blackEaten = 0; // כמה שחורים אכולים יש
var whiteScore = 0; // כמה נקודות יש לשחקן הלבן
var blackScore = 0; // כמה נקודות יש לשחקן השחור
var currentPlayer = 1;// משתנה גלובלי שיחזיק את השחקן הנוכחי (1 או 2), ניתן לעדכן אותו בפונקציה playerturn ולהשתמש בו בפונקציה move כדי לדעת איזה חיילים מותר להזיז
var musicStarted = false; // משתנה שיזכור אם כבר לחצנו Play Music כדי להפעיל את המוזיקה, כדי שהכפתור יפעל נכון בפעם הראשונה ובפעמים הבאות
var bgMusic = new Audio('backgroundmusic.mp3'); // יצירת אובייקט מוזיקה גלובלי כדי שנוכל לשלוט עליו מכל פונקציה
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
    if (diceRemaining==true)
    {
        return;
    }
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;
    if (dice1 == dice2)
    {
        currentDice = [dice1, dice1, dice1, dice1];
    } else
    {
        currentDice = [dice1, dice2];
    }
    var dicesound = new Audio('dicerollsound.mp3');
    dicesound.volume = 0.3;
    dicesound.play();
    document.getElementById("dice1").src = "dice_" + dice1 + "-removebg-preview.png";
    document.getElementById("dice2").src = "dice_" + dice2 + "-removebg-preview.png";
}
function playerturn()// פונקציה שמחזירה את השחקן הנוכחי על פי מספר התור, היא גם מעדכנת את משתנה currentPlayer שניתן להשתמש בו בפונקציה move כדי לדעת איזה חיילים מותר להזיז
{
    var noticeturn = document.getElementById("visturn");
    if (countturn % 2 == 0)
    {
        noticeturn.innerHTML = "Player black turn";
        /*alert("Player 1's turn");*/
        countturn++;
        return 1;
    }
    else
    {
        noticeturn.innerHTML = "Player white turn";
        /*alert("Player 2's turn");*/
        countturn++;
        return 2;
    }
}
function move(clickedIndex)// פונקציה שמטפלת בלחיצות על הלוח, היא צריכה לטפל בשלושה מצבים: 1. אם יש חיילים אכולים, היא צריכה לנסות להכניס אותם חזרה ללוח במקום המתאים. 2. אם השחקן יכול להתחיל להוציא חיילים (כל החיילים שלו בבית ואין לו אכולים), לחיצה כפולה על חייל תוציא אותו מהמשחק. 3. בחירה ותנועה רגילה של חיילים, כולל בדיקת חוקי התנועה והאכילה.
{
    var turnOwner; // הצהרה על המשתנה

    if (countturn % 2 == 0)
    {
        turnOwner = 1; // אם השארית היא 0, התור של שחקן 1
    } else
    {
        turnOwner = 2; // אחרת, התור של שחקן 2
    }

    // 1. טיפול בחיילים אכולים
    if (turnOwner == 1 && whiteEaten > 0)
    {
        reEnterPiece(clickedIndex);
        return;
    }
    if (turnOwner == 2 && blackEaten > 0) 
    { 
        reEnterPiece(clickedIndex);
        return; 
    }
    // 2. לוגיקה של הוצאת חיילים (Bear Off) - לחיצה כפולה
    if (selectedIndex == clickedIndex && selectedIndex !== -1)
    {
        var from = selectedIndex;
        var diceIdx = -1;

        if (turnOwner == 1 && canPlayerBearOffWhite(1))
        {
            var requiredDice = 24 - from; // מרחק ליציאה (למשל מ-23 צריך 1)

            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] > 0)
                {
                    if (currentDice[i] == requiredDice)
                    {
                        diceIdx = i; break;
                    }
                    // חוק שש-בש: מותר להוציא עם קובייה גבוהה יותר אם אין חיילים רחוקים יותר
                    if (currentDice[i] > requiredDice)
                    {
                        var pieceBehind = false;
                        for (var j = 18; j < from; j++)
                        {
                            if (startpositionboard[j] > 0) pieceBehind = true;
                        }
                        if (!pieceBehind) {
                            diceIdx = i; break;
                        }
                    }
                }
            }
            if (diceIdx != -1)
            {
                startpositionboard[from]--;
                whiteScore++;
                currentDice[diceIdx] = 0;
                selectedIndex = -1;
                updateBoardVisuals();
                checkwinner();
                finishTurnIfNeeded();
                return;
            }
        }

        if (turnOwner == 2 && canPlayerBearOffBlack(2))
        {
            var requiredDice = from + 1; // מרחק ליציאה (למשל מ-0 צריך 1)

            for (var i = 0; i < currentDice.length; i++)
            {
                if (currentDice[i] > 0) {
                    if (currentDice[i] === requiredDice)
                    {
                        diceIdx = i; break;
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
                        if (!pieceBehind)
                        {
                            diceIdx = i; break;
                        }
                    }
                }
            }
            if (diceIdx != -1)
            {
                startpositionboard[from]++;
                blackScore++;
                currentDice[diceIdx] = 0;
                selectedIndex = -1;
                updateBoardVisuals();
                checkwinner();
                finishTurnIfNeeded();
                return;
            }
        }
    }

    // 3. בחירה ותנועה רגילה
    if (selectedIndex == -1)
    {
        if ((turnOwner == 1 && startpositionboard[clickedIndex] > 0) ||(turnOwner === 2 && startpositionboard[clickedIndex] < 0))
        {
            selectedIndex = clickedIndex;
        }
    }
    else
    {
        var from = selectedIndex;
        var to = clickedIndex;

        // מניעת תנועה אחורה
        if (turnOwner == 1 && to <= from)
        {
            selectedIndex = -1; return;
        }
        if (turnOwner == 2 && to >= from)
        {
            selectedIndex = -1; return;
        }
        var distance = Math.abs(to - from);
        var foundDiceIndex = -1;

        for (var i = 0; i < currentDice.length; i++)
        {
            if (currentDice[i] == distance && distance !== 0) {
                foundDiceIndex = i;
                break;
            }
        }
        if (foundDiceIndex == -1)
        {
            selectedIndex = -1; return;
        }
        var targetValue = startpositionboard[to];
        if (turnOwner == 1)
        {
            if (targetValue <= -2)
            {
                selectedIndex = -1; return;
            }
            if (targetValue == -1)
            {
                blackEaten++; startpositionboard[to] = 1;
            }
            else
            {
                startpositionboard[to]++;
            }
            startpositionboard[from]--;
        }
        else
        {
            if (targetValue >= 2)
            {
                selectedIndex = -1;
                return;
            }
            if (targetValue == 1)
            {
                whiteEaten++;
                startpositionboard[to] = -1;
            }
            else
            {
                startpositionboard[to]--;
            }
            startpositionboard[from]++;
        }

        currentDice[foundDiceIndex] = 0;
        updateBoardVisuals();
        selectedIndex = -1;
        checkwinner();
        finishTurnIfNeeded();
    }
}
function skipTurn()// פונקציה שמאפשרת לשחקן לדלג על תורו אם אין לו מהלכים חוקיים, היא מאפסת את הקוביות ומעבירה את התור לשחקן הבא
{
    // 1. איפוס הקוביות של התור הנוכחי
    currentDice = [0, 0, 0, 0];

    // 2. עדכון ויזואלי (כדי שהשחקן יראה שהקוביות נעלמו)
    // אם יש לך אלמנטים שמציגים את מספר הקוביות, כדאי לאפס אותם כאן

    // 3. העברת התור לשחקן הבא באמצעות הפונקציה הקיימת שלך
    currentPlayer = playerturn();

    // 4. הודעה לשחקן
    /*alert("אין מהלכים חוקיים, התור עובר ליריב.");*/

    // 5. איפוס הבחירה למקרה שחייל היה מסומן
    selectedIndex = -1;
    updateBoardVisuals();
}

// פונקציית עזר לסיום תור כדי לא לשכפל קוד
function finishTurnIfNeeded() // בודקת אם יש קוביות שנותרו לתור הנוכחי, ואם לא, עוברת לתור הבא
{
    var movesLeft = false;
    for (var j = 0; j < currentDice.length; j++)
    {
        if (currentDice[j] > 0)
        {
            movesLeft = true;
        }
    }
    if (!movesLeft) currentPlayer = playerturn();
}
function updateBoardVisuals()// פונקציה שמעדכנת את הלוח הויזואלי בהתאם למצב הנוכחי של המערך startpositionboard, היא עוברת על כל המשבצות ומעדכנת את התמונה המתאימה לפי כמות הכלים שיש בכל משבצת, היא גם מפעילה סאונד של תזוזת כלי בכל פעם שהיא נקראת
{
    eatenpiecesvisual()
    for (var i = 0; i < 24; i++)
    {
        var count = startpositionboard[i];
        var imgElement = document.getElementById("img" + i);

        if (!imgElement)
        {
            continue;
        }

        // --- החלפת הקיצור של הכיוון ---
        var direction;
        if (i <= 11)
        {
            direction = "upside";
        } else
        {
            direction = "";
        }

        // --- החלפת הקיצור של צבע המשבצת ---
        var boardColor;
        if (i % 2 == 0)
        {
            boardColor = "black";
        } else {
            boardColor = "white";
        }

        // עדכון התמונה בהתאם לכמות הכלים
        if (count > 0)
        {
            imgElement.src = direction + boardColor + "-" + count + "white.png";
        }
        else if (count < 0)
        {
            imgElement.src = direction + boardColor + "-" + Math.abs(count) + "black.png";
        }
        else
        {
            imgElement.src = direction + boardColor + ".png";
        }
    }

    // הפעלת סאונד
    var movesound = new Audio('piecemovesound.mp3');
    movesound.volume = 0.3;
    movesound.play();
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
function reEnterPiece(clickedIndex)// פונקציה שמטפלת בלחיצה על לוח כאשר יש חיילים אכולים, היא מנסה להכניס את החייל האכול חזרה ללוח במקום המתאים לפי הקוביות שיש, אם זה לא אפשרי היא לא עושה כלום
{
    var turnOwner;
    if (countturn % 2 == 0)
    {
        turnOwner = 1; // לבן
    }
    else
    {
        turnOwner = 2; // שחור
    }

    var to = clickedIndex;
    var targetValue = startpositionboard[to];
    var distance;

    // חישוב המרחק שהקובייה צריכה לעשות כדי להיכנס
    if (turnOwner == 1)
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
    if (turnOwner == 1)
    {
        if (to < 0 || to > 5)
        {
            return; // לבן יכול להיכנס רק ל-0 עד 5
        }
    }
    if (turnOwner == 2)
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
        if (currentDice[i] == distance)
        {
            foundDiceIndex = i;
            break;
        }
    }

    // אם לא מצאנו קובייה מתאימה, אי אפשר להיכנס
    if (foundDiceIndex == -1)
    {
        return;
    }

    // בדיקה: האם המשבצת חסומה על ידי היריב?
    if (turnOwner == 1)
    {
        if (targetValue <= -2)
        {
            alert("המשבצת חסומה על ידי השחור!");
            return;
        }
        // כניסה של לבן
        if (targetValue == -1)
        {
            blackEaten = blackEaten + 1; // אכילה
            startpositionboard[to] = 1;
        }
        else
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
        if (targetValue == 1)
        {
            whiteEaten = whiteEaten + 1; // אכילה
            startpositionboard[to] = -1;
        }
        else
        {
            startpositionboard[to] = startpositionboard[to] - 1;
        }
        blackEaten = blackEaten - 1; // מורידים חייל מהסל
    }

    // סגירת המהלך
    currentDice[foundDiceIndex] = 0;
    updateBoardVisuals();
    
    var movesound = new Audio('piecemovesound.mp3');
    movesound.volume = 0.3;
    movesound.play();

    // בדיקה אם נגמרו כל הקוביות בתור
    var movesLeft = false;
    for (var j = 0; j < currentDice.length; j++)
    {
        if (currentDice[j] > 0)
        {
            movesLeft = true;
        }
    }

    if (movesLeft == false) 
    {
        currentPlayer = playerturn();
    }
}
function canPlayerBearOffWhite(player)// פונקציה שבודקת אם שחקן יכול להתחיל להוציא חיילים, כלומר כל החיילים שלו נמצאים בבית שלו (לבן: 18-23)  ואין לו חיילים אכולים
{
    if (player == 1 && whiteEaten > 0)
    {
        return false;
    }
    for (var i = 0; i < 24; i++)
    {
        // לשחקן 1 (לבן): מחפשים חייל מחוץ לטווח 18-23
        if (player == 1 && startpositionboard[i] > 0 && i < 18)
        {
            return false;
        }
    }
    return true; // כל החיילים בבית
}
function canPlayerBearOffBlack(player)// פונקציה שבודקת אם שחקן יכול להתחיל להוציא חיילים, כלומר כל החיילים שלו (שחור: 0-5) נמצאים בבית שלו ואין לו חיילים אכולים
{
    // אם יש חייל אכול, אי אפשר להוציא חיילים!
    if (player == 2 && blackEaten > 0)
    {
        return false;
    }
    for (var i = 0; i < 24; i++)
    {
        // לשחקן 2 (שחור): מחפשים חייל מחוץ לטווח 0-5
        if (player == 2 && startpositionboard[i] < 0 && i > 5)
        {
            return false;
        }
    }
    return true; // כל החיילים בבית
}
function checkwinner()// פונקציה שבודקת אם אחד השחקנים ניצח, כלומר אין לו חיילים על הלוח ואין לו אכולים, אם יש מנצח היא מציגה הודעה ומאתחלת את המשחק
{
    var whiteExists = false;
    var blackExists = false;

    for (var i = 0; i < 24; i++)
    {
        if (startpositionboard[i] > 0) whiteExists = true;
        if (startpositionboard[i] < 0) blackExists = true;
    }

    // אם לבן לא קיים על הלוח ואין לו אכולים (והוא התחיל להוציא)
    if (!whiteExists && whiteEaten == 0)
    {
        alert("White wins!");
        resetGame();
    }
    // אם שחור לא קיים על הלוח ואין לו אכולים
    else if (!blackExists && blackEaten == 0)
    {
        alert("Black wins!");
        resetGame();
    }
}
function backgroundmusic()
{
    var bgMusic = new Audio('backgroundmusic.mp3');
    bgMusic.loop = true; // המוזיקה תחזור על עצמה
    bgMusic.volume = 0.2; // ווליום עדין כדי לא להפריע
    bgMusic.play();
}
function eatenpiecesvisual()// פונקציה שמעדכנת את הויזואל של החיילים האכולים, היא מעדכנת את האלמנטים שמראים כמה חיילים אכולים יש לכל שחקן לפי המשתנים whiteEaten וblackEaten
{
    var eatenPiecesDiv = document.getElementById("eatenpieces");
    eatenPiecesDiv.innerHTML = "White eaten: " + whiteEaten + "<br>" + "Black eaten: " + blackEaten;
}
backgroundmusic()
checkwinner();
updateBoardVisuals();