/* Programschema - 
Deklarera variabler, lägg till händelsehanterare och hämta från innerhtml med hjälp av referering

Starta spel, inaktivera knapp för nytt spel, aktivera knapp för nya brickor
btn för nya brickor ska ge 4 nya brickor som väljs slumpmässigt, math random mellan brickorna 1-40. 
en bricka ska endast kunna användas en gång. använd splice. de nya brickorna ska placeras i rutorna ovanför knappen
addoneventlistener ( i init funktionen ) för att dra brickorna till valfri plats i spelplanen. en bricka i taget.
medan man drar brickan ska den tomma plats man drar över markeras med annan färg. kolla lab 6. 
aktivera startbtn igen när alla brickor är lagda, och få fram 4 nya brickor.

Både i spelplanen och i rutorna för de fyra brickor man fått slumpmässigt ska två olika klasser användas:
brickEmpty ska användas då rutan är tom.
brickFront ska användas då rutan innehåller en bricka, dvs då den innehåller ett nummer.
när allla rader är fyllda, kontrollera så det är en stigande serie, så numret i varje bricka är högre än
i föregående bricka if (a > b) markera med grönt block (&check;) till höger om raden eller under kolumnen
        if (!a > b ) markera med ett rött kryss (&cross;) 

räkna antal korrekta rader, points++, och sedan skriv ut UNDER spelplanen, msgElem.innerHTML = points;
addera poängen till totalpoängen totalPoints += points;
lägg till en räknare för antal spel också. var totalGames; vid varje avslutat spel ska totalGames++.
Totalpoängen och räknaren (counter) för antal spel ska visas upp i högra hörnet. 

spara totalPoints och counter localstorage eller i en cookie. De ska sparas i samma variabel eller i en cookie.
de poäng man haft tidigare när man stängde sidan ska sparas och visas upp när man öppnar upp sidan igen. 
ta med mitt användarid i namnet på variabeln i localStorage eller i namnet på cookien, lb223qk.
när spelet är klart, aktivera startgamebtn 

För brickorna på första raden används r1, andra raden r2 osv.
alla brickor som ligger på första kolumnen är c1 och andra c2 osv.
de ska användas när det kontrolleras om det är en stigande serie eller inte, för att få ut 
vilka brickor som finns på just den raden eller kolumnen
sedan använda sig av r1mark, r2mark och mark för bock och kryss
*/
// bilderna
const allImgs = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18",
"19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38",
"39","40"];

// Globala konstanter och variabler 
   var totalPoints; // referens till totala poäng
   var countGames ; // referens till antal spel
   var totPointsElem; // referens till span elementet totala poäng
   var countGamesElem; // referens till span elementet countgames räkna antal spel 
   var points = 0; // referens till antal poäng, sätter till 0 inför varje omgång
   var bricksElem; // referens till table elementet med de 16 brickor
   var bricksImgElem; // referens till bilderna     
   var bricks; // array med bilder
   var picsNumber; // nummer till bilderna efter konvertering med Number()
   var newGameBtn;  // referens till nytt spel knapp 
   var newBricksBtn; // referens knapp för nya brickor 
   var newBricksElem; // referens till div elementet för de 4 nya brickorna
   var path; // referens till omvandling av img tagg till nr
   var msgElem; // referens till div elementet för utskrift

// element vid drag and drop 
   var dragNumberElem; // det nummer som dras 

// initiera globala variabler och lägg kopplingar till knappar
function init() {

   // Referenser till element i gränssnittet 
   bricksElem = document.getElementById("board").getElementsByClassName("empty");   
   bricksImgElem = document.getElementById("newBricks").getElementsByTagName("img");
   newGameBtn = document.getElementById("newGameBtn");
   newBricksBtn = document.getElementById("newBricksBtn");
   totPointsElem = document.getElementById("totPoints");
   countGamesElem = document.getElementById("countGames");
   msgElem = document.getElementById("message");

   // kopierade kortleken för drag av brickor i funktionen getNewBricks
   bricks = allImgs.slice(0);


    // lägg ihop localstorage värdena 
   if(localStorage.lb223qkUserInfo) { // om localstorage finns 
       let dataArr = localStorage.lb223qkUserInfo.split("&"); // splitta totalpoints och countgames
       countGames = Number(decodeURIComponent(dataArr[0])); // hämta countgames som nummer
       totalPoints = Number(decodeURIComponent(dataArr[1])); // hämta totalpoints som nummer
       totPointsElem.innerHTML = totalPoints; // lägger in och skriver ut totala poäng i totpointselem
       countGamesElem.innerHTML = countGames; // lägger in och skriver ut antal spel i countgameselem
    }
        // annars sätt toala poäng och antal spel till 0    
        else 
        {
             totalPoints = 0;
             countGames = 0;
        }
        
   //  lägg på händelsehanterare 
   newGameBtn.addEventListener("click", startGame);
   newBricksBtn.addEventListener("click",getNewBricks);

   // vid öppning av sidan är newbricksbtn avaktiverad
   newBricksBtn.disabled = true; 
   
} // end init
window.addEventListener("load", init);

// ------------------------------
// starta spelet    
function startGame() {
/* Starta spel, inaktivera knapp för nytt spel, aktivera knapp för nya brickor
Om spelet har spelats innan, rensa brädan, bockarna och kryssen
*/
// hämta class brick och mark
allBricks = document.getElementsByClassName("brick");
mark = document.getElementsByClassName("mark");

// gå igenom mark length och ta bort alla kryss och bockar
for (let i = 0; i < mark.length; i++) {
    mark[i].innerHTML = "";
}
/*
 tar bort brick från varje element och minskar listans storlek
Om man är på element 0 och den tas bort så flyttas allt till vänster ett steg
När i++ går till 1 har den då hoppat över ett element. Går baklänges istället så att alla element berörs
och sedan tar bor dem
*/
for (let i = allBricks.length-1; i >= 0; i--) {
        allBricks[i].src = "img/empty.png";
        allBricks[i].classList.add("empty");
        allBricks[i].classList.remove("brick");
}
newGameBtn.disabled = true // startknappen är avstängd efter man startar spelet   
newBricksBtn.disabled = false; // när startknappen klickas aktiveras newbricksbtn
} // end startGame

// få fram nya brickor 
function getNewBricks() {
/* newbricksbtn för nya brickor ska ge 4 nya brickor som väljs slumpmässigt, math random mellan brickorna 1-40. 
en bricka ska endast kunna användas en gång. använd splice. de nya brickorna ska placeras i rutorna ovanför knappen
addoneventlistener ( i init funktionen ) för att dra brickorna till valfri plats i spelplanen. en bricka i taget.
-- medan man drar brickan ska den tomma plats man drar över markeras med annan färg. kolla lab 6. 
aktivera newbricksbtn igen när alla brickor är lagda, och få fram 4 nya brickor. 
*/
newBricksBtn.disabled = true;
for (let i = 0; i < 4; i++) { // loopen körs så länge värdet är under 4
    let r = Math.floor(bricks.length * Math.random()); // plockar ut random 4 nummer i newBricks
    let ix = bricks[r]; // lägger in bricks och parametern med bilderna[r] i ix.
    bricksImgElem[i].src = "img/" + ix + ".png"; // läggger in bilderna/numrena i img src
    bricks.splice(r,1); // tar bort de olika bilderna så de inte kan användas igen
}
for (let i = 0; i < bricksImgElem.length; i++){ // går igenom bricksImgElems
    bricksImgElem[i].addEventListener("dragstart",dragStart); // händelsehanterare för att dra ordet
    bricksImgElem[i].addEventListener("dragend",dragEnd); // händelsehanterare för att släppa ordet
    bricksImgElem[i].draggable = true; // gör numrena/bilderna dragbara
   
} 
} // end getNewBricks

// Ett nummer börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragStart(e) { // e är Event-objektet
	for (let i = 0; i < bricksElem.length; i++){ // går igenom brickselem
		bricksElem[i].addEventListener("dragover", dragDrop); // händelsehanterare för när numrets är över bilden
		bricksElem[i].addEventListener("drop", dragDrop); // händelsehanterare för när bilden släpps
        bricksElem[i].addEventListener("dragleave",dragDrop); // händelsehanterare för när man lämnar bilden, inte längre hovrar över den
        
    }
    dragNumberElem = this; // placerar bilden i dragnumberelem
    e.dataTransfer.setData("url",this.src); // sparar urlen genom datatransfer
} // End dragstart

// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragEnd() {
	for (let i = 0; i < bricksElem.length; i++){ // går igenom imgelems 
    bricksElem[i].removeEventListener("dragover", dragDrop); // händelsehanterare för när numret är över bilden
    bricksElem[i].removeEventListener("drop", dragDrop); // händelsehanterare för när bilden släpps
    bricksElem[i].removeEventListener("dragleave", dragDrop); // händelsehanterare för när man lämnar bilden, inte längre hovrar över den
} // End dragend
}

/* Funktionen hanterar när bilden släpps på eventuell bricka, tar bort och lägger till klass
och kollar om de 16 brickorna är fulla. Till sist aktiverar och avaktiverar newbricksbtn
*/ 
function dragDrop(e) { // e är Event-objektet
	e.preventDefault(); // tar bort webbläsarens default beteende
    if (e.type == "dragover") { // om e type är dragover 
        this.style.backgroundColor = "#CCC"; // lägger till färg när man pekar över brickan
    }
    if (e.type == "dragleave") { // om e type är dragleave
        this.style.backgroundColor = ""; // tar bort färg när man slutar peka över brickan
    }
        if (e.type == "drop") { // om e.type är drop
            this.style.backgroundColor = ""; // tar bort backgrundsfärg på brickan
            dragNumberElem.src = "img/empty.png"; // lägger in bilden empty 
            let imgUrl = e.dataTransfer.getData("url"); // håmta dragna numret och spara det i dragnumberelem
            dragNumberElem.draggable = false; // gör så att vita bilde inte kan dras
            this.src = imgUrl; // lägg in urlen i this (brickselem)
            this.classList.remove("empty"); // tar bort class empty ur this (brickselem)
            this.classList.add("brick");  // lägger till class brick med alla img taggar i this (brickselem)
            console.log(this);
            this.removeEventListener("dragover", dragDrop); // tar bort händelsehanterare för när bilden är över bilden
            this.removeEventListener("drop", dragDrop); // tar bort händelsehanterare för när bilden släpps
            this.removeEventListener("dragleave", dragDrop); // tar bort händelsehanterare för när man lämnar bilden  

            if (bricksElem.length == 0) { // om de 16 brickorna är fulla (brickselems array är tom)
                checkBoard(); // anropa checkBoard när sista brickan är lagd
        // kolla sedan för att ta bort alla brickor
        newGameBtn.disabled = false; // aktivera för nytt spel
    }      
    var NaNs = 0; // sätter nans till 0   
    for (let i = 0; i < bricksImgElem.length; i++){ // går igenom bricksImgElems
        var num = changeToNumber(bricksImgElem[i]); // ändrar bilderna till nummer 
        // om nan är nummer nans++ 
        if (isNaN(num)) { 
        NaNs++;
        }
    }   // innehåller den 4 nans så aktivera newbricksbtn, annars ha den avaktiverad
        if (NaNs == 4) {    
            newBricksBtn.disabled = false;
        }
        else {
            newBricksBtn.disabled = true;
        }
        if (bricksElem.length == 0)
        newBricksBtn.disabled = true;
        }

    } // end dragdrop

    // plockar ut bildens nummer
    function changeToNumber(bricksElem) {
        path = bricksElem.src; // lägger i bild(nummer) i path
        path = path.split("/"); // tar bort / 
        path = path[path.length-1]; // tar bort sista elementet i path
        path = path.split(".")[0]; // tar bort png för att få fram numret ensam 
        picsNumber = Number(path); // sparar bildens nummer genom number i picsnumber

        return picsNumber; // returnerar picsNumber för att sedan kunna använda för att jämföra alla bilder
    } // end changeToNumber

// kolla om det är en stigande serie
function checkBoard() {

    // hämtar r1,r2,r3,r4
    let r1 = document.getElementsByClassName("r1"); 
    let r2 = document.getElementsByClassName("r2");
    let r3 = document.getElementsByClassName("r3");
    let r4 = document.getElementsByClassName("r4");
    // hämtar c1,c2,c3,c4
    let c1 = document.getElementsByClassName("c1"); 
    let c2 = document.getElementsByClassName("c2"); 
    let c3 = document.getElementsByClassName("c3"); 
    let c4 = document.getElementsByClassName("c4"); 

    // lägger in referenser till bock eller kryss för r
    let r1mark = document.getElementById("r1mark");
    let r2mark = document.getElementById("r2mark");
    let r3mark = document.getElementById("r3mark");
    let r4mark = document.getElementById("r4mark");
    // lägger in referenser till bock eller kryss för c
    let c1mark = document.getElementById("c1mark");
    let c2mark = document.getElementById("c2mark");
    let c3mark = document.getElementById("c3mark");
    let c4mark = document.getElementById("c4mark");

    /* Uppdaterar raderna. Ger r raderna och kolumnerna c antingen bock eller kryss beroende
       på om det är en stigande serie eller inte genom att kalla på funktionen
       updateBock */
    updateBock(r1, r1mark);
    updateBock(r2, r2mark);
    updateBock(r3, r3mark);
    updateBock(r4, r4mark);
    updateBock(c1, c1mark);
    updateBock(c2, c2mark);
    updateBock(c3, c3mark);
    updateBock(c4, c4mark);


    // kollar alla olika rader för stigande serie, rad för rad, vid lägre siffra - avbryt och kolla nästa
   
    if (checkLine(r1) 
        && checkLine(r2)
        && checkLine(r3)
        && checkLine(r4)
        && checkLine(c1)
        && checkLine(c2)
        && checkLine(c3)
        && checkLine(c4)) 
        {}
       // uppdaerar countgames
       countGames++; // för varje gång brädan uppdateras plussa 1 på countgames
       countGamesElem.innerHTML = countGames; //skriver ut totppoints
       
       // uppdaterar totala poäng
       totalPoints += points; // sparar points poäng för att sedan kunna spara det med userstorage
       totPointsElem.innerHTML = totalPoints; //skriver ut totppoints

       // lägg ihop localstorage värden
       localStorage.lb223qkUserInfo = Number(encodeURIComponent(countGames)) + "&"
       + Number(encodeURIComponent(totalPoints)); // lägger in & som skiljetecken och skickar med variablarnas värde med Number
} // end checkBock

/* uträkningen för att kolla om det är en stigande serie, skapar en lista, går igenom listan
och lägger första bildens i n1 och omvandlar till nummer. lägger andra bilden i n2 och omvandlar till nr
kollar om andra bilden är större än första, i så fall gå vidare till nästa, om det inte är större, returnera falskt
*/
function checkLine(list) {
    for (let i = 0; i < list.length -1; i++) { // går igenom listan, -1 annars blir det index out of bounds
        var n1 = changeToNumber(list[i]); // ger första brickans värde(nummer) till variabel n1 via funktionen changetonumber
        var n2 = changeToNumber(list[i+1]); // ger andra brickans värde(nummer) till variabel n2 via funktionen changetonumber
        if (n2 > n1) { // om n2 är större än n1, gå vidare
        }
        else { // annars är numret inte större
            return false; // isåfall returnera falskt  
        }
    }
    return true; // returnera true om numret är större
} // end checkLine

// visa bock eller X och räkna poäng, refererar till mark med innerhtml
function updateBock(list, mark) {
    if (checkLine(list)) {
        mark.innerHTML = "<span style='color: #00FF00;'>&check;</span>";
        points++; // ger points +1 per korrekt rad
        msgElem.innerHTML =  "du fick " + points + " poäng" // utskrift av poäng och meddelande
    }
    else {
        mark.innerHTML = "<span style='color: #ff0000;'>&cross;</span>"; // visar bock om det är en stigande serie
    }
} // end updateBock
