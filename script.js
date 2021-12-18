let bombsNumber; // it has to be an even number;
let gridSize; //number of buttons on each side of the square grid;
let playArea = document.getElementById("play-area");
let flagsLeftBoard = document.getElementById("flags-left");

function createGrid(grid_size, bombs_number) {
  gridSize = grid_size;
  bombsNumber = bombs_number;
  let width = gridSize * 30;
  let gameHeader = document.getElementById("game-header");
  gameHeader.style.width = width.toString() + "px";
  let infoBoard = document.getElementById("info-board");
  let gridTemplateColumn;
  if (gridSize === 10) {
    gridTemplateColumn = "125px 40px 85px 40px";
  } else if (gridSize === 16) {
    gridTemplateColumn = "215px 40px 175px 40px";
  } else {
    gridTemplateColumn = "275px 40px 235px 40px";
  }
  infoBoard.style.gridTemplateColumns = gridTemplateColumn;
  flagsLeftBoard.innerHTML = "<b>Flags left: " + bombsNumber + "</b>";
  let chooseLevel = document.getElementById("choose-level");
  chooseLevel.style.display = "none";
  playArea.style.display = "grid";
  playArea.style.width = width.toString() + "px";
  const buttonSize = "30px ";
  playArea.style.gridTemplateColumns = buttonSize.repeat(gridSize);
  const idArray = [];
  for (let i = 1; i <= gridSize; ++i) {
    for (let j = 1; j <= gridSize; ++j) {
      let gridButton = document.createElement("button");
      gridButton.setAttribute("type", "button");
      gridButton.classList.add("grid-button");
      let id = String.fromCharCode(64 + i) + j;
      idArray.push(id);
      gridButton.setAttribute("id", id);
      gridButton.setAttribute("data", 0);
      gridButton.onclick = function() {click(id);};
      gridButton.addEventListener("contextmenu", function(ev) {
                                                                ev.preventDefault();
                                                                flagButton(gridButton);
                                                                return false;
                                                              }, false);
      playArea.appendChild(gridButton);
    }
  }

  const idArrayH1 = idArray.slice(0, gridSize * gridSize / 2);
  const idArrayH2 = idArray.slice(-gridSize * gridSize / 2);
  const bombsArrayH1 = idArrayH1.sort(() => 0.5 - Math.random()).slice(0, bombsNumber / 2);
  const bombsArrayH2 = idArrayH2.sort(() => 0.5 - Math.random()).slice(0, bombsNumber / 2);
  const bombsArray = bombsArrayH1.concat(bombsArrayH2);
  for (let id of bombsArray) {
    document.getElementById(id).classList.add("hidden-bombs");
  }
  let nearbyBombs;
  for (let id of bombsArray) {
    if (id.substring(1) != gridSize) {
      let eastId = id.charAt(0) + (parseInt(id.substring(1)) + 1);
      let eastNbr = document.getElementById(eastId);
      nearbyBombs = eastNbr.getAttribute("data");
      eastNbr.setAttribute("data", ++nearbyBombs);
    }
    if (id.substring(1) != 1) {
      let westId = id.charAt(0) + (parseInt(id.substring(1)) - 1);
      let westNbr = document.getElementById(westId);
      nearbyBombs = westNbr.getAttribute("data");
      westNbr.setAttribute("data", ++nearbyBombs);
    }
    if (id.charCodeAt(0) - 64 != gridSize) {
      let southId = String.fromCharCode(id.charCodeAt(0) + 1) + id.substring(1);
      let southNbr = document.getElementById(southId);
      nearbyBombs = southNbr.getAttribute("data");
      southNbr.setAttribute("data", ++nearbyBombs);
    }
    if ((id.charCodeAt(0) - 64 != gridSize) && (id.substring(1) != gridSize)) {
      let southEastId = String.fromCharCode(id.charCodeAt(0) + 1) + (parseInt(id.substring(1)) + 1);
      let southEastNbr = document.getElementById(southEastId);
      nearbyBombs = southEastNbr.getAttribute("data");
      southEastNbr.setAttribute("data", ++nearbyBombs);
    }
    if ((id.charCodeAt(0) - 64 != gridSize) && (id.substring(1) != 1)) {
      let southWestId = String.fromCharCode(id.charCodeAt(0) + 1) + (parseInt(id.substring(1)) - 1);
      let southWestNbr = document.getElementById(southWestId);
      nearbyBombs = southWestNbr.getAttribute("data");
      southWestNbr.setAttribute("data", ++nearbyBombs);
    }
    if (id.charAt(0) != "A") {
      let northId = String.fromCharCode(id.charCodeAt(0) - 1) + id.substring(1);
      let northNbr = document.getElementById(northId);
      nearbyBombs = northNbr.getAttribute("data");
      northNbr.setAttribute("data", ++nearbyBombs);
    }
    if ((id.charAt(0) != "A") && (id.substring(1) != gridSize)) {
      let northEastId = String.fromCharCode(id.charCodeAt(0) - 1) + (parseInt(id.substring(1)) + 1);
      let northEastNbr = document.getElementById(northEastId);
      nearbyBombs = northEastNbr.getAttribute("data");
      northEastNbr.setAttribute("data", ++nearbyBombs);
    }
    if ((id.charAt(0) != "A") && (id.substring(1) != 1)) {
      let northWestId = String.fromCharCode(id.charCodeAt(0) - 1) + (parseInt(id.substring(1)) - 1);
      let northWestNbr = document.getElementById(northWestId);
      nearbyBombs = northWestNbr.getAttribute("data");
      northWestNbr.setAttribute("data", ++nearbyBombs);
    }
  }
}

let seconds = 0;
let secondsCounter = document.getElementById("seconds-counter");
let timer;
let firstClick = true;
let gameIsOver = false;

function click(id) {
  if (firstClick) {
    timer = setInterval(countSeconds, 1000);
    firstClick = false;
  }
  let gridButton = document.getElementById(id);
  if (gameIsOver) {
    return;
  }
  if (gridButton.classList.contains("pushed-button") || gridButton.classList.contains("flagged-button")) {
    return
  }
  if (gridButton.classList.contains("hidden-bombs")) {
    gameOver();
  } else if (gridButton.getAttribute("data") > 0) {
    let nearbyBombs = gridButton.getAttribute("data");
    gridButton.innerHTML = nearbyBombs;
    displayColor(nearbyBombs, gridButton);
    gridButton.classList.add("pushed-button");
    checkGameWon();
  } else {
    gridButton.classList.add("pushed-button");
    gridButton.disabled = true;
    checkNearbyButtons(id);
    checkGameWon();
  }
}

let flagsNumber = 0;

function flagButton(gridButton) {
  if (gameIsOver) {
    return;
  }
  if (flagsNumber <= bombsNumber && !gridButton.classList.contains("pushed-button")) {
    let flagsLeft;
    if (!gridButton.classList.contains("flagged-button")) {
      if (flagsNumber < bombsNumber) {
      gridButton.classList.add("flagged-button");
      ++flagsNumber;
      flagsLeft = bombsNumber - flagsNumber;
      flagsLeftBoard.innerHTML = "<b>Flags left: " + flagsLeft + "</b>";
      }
    } else {
      gridButton.classList.remove("flagged-button");
      --flagsNumber;
      flagsLeft = bombsNumber - flagsNumber;
      flagsLeftBoard.innerHTML = "<b>Flags left: " + flagsLeft + "</b>";
    }
  }
}

function countSeconds() {
  ++seconds;
  secondsCounter.innerHTML = "<b>" + seconds + "</b>";
  if (seconds === 999) {
  clearInterval(timer);
  }
}

function gameOver() {
  document.getElementById("new-game").innerHTML = "<img src=\"Sad-face.png\"/>";
  let bombs = document.getElementsByClassName("hidden-bombs"); 
  for (let bomb of bombs) {
    bomb.classList.add("detonated-bomb"); 
  }
  clearInterval(timer);
  gameIsOver = true;
}

function displayColor(nearbyBombs, gridButton) {
  if (nearbyBombs == 2) {
    gridButton.style.color = "green";
  } else if (nearbyBombs == 3) {
    gridButton.style.color = "red";
  } else if (nearbyBombs == 4) {
    gridButton.style.color = "darkblue";
  } else if (nearbyBombs == 5) {
    gridButton.style.color = "brown";
  } else if (nearbyBombs > 5) {
    gridButton.style.color = "orange";
  }
}

function checkNearbyButtons(id) {
  setTimeout(() => {
    if (id.substring(1) != gridSize) {
      let eastId = id.charAt(0) + (parseInt(id.substring(1)) + 1);
      click(eastId);
    }
    if (id.substring(1) != 1) {
      let westId = id.charAt(0) + (parseInt(id.substring(1)) - 1);
      click(westId);
    }
    if (id.charCodeAt(0) - 64 != gridSize) {
      let southId = String.fromCharCode(id.charCodeAt(0) + 1) + id.substring(1);
      click(southId);
    }
    if ((id.charCodeAt(0) - 64 != gridSize) && (id.substring(1) != gridSize)) {
      let southEastId = String.fromCharCode(id.charCodeAt(0) + 1) + (parseInt(id.substring(1)) + 1);
      click(southEastId);
    }
    if ((id.charCodeAt(0) - 64 != gridSize) && (id.substring(1) != 1)) {
      let southWestId = String.fromCharCode(id.charCodeAt(0) + 1) + (parseInt(id.substring(1)) - 1);
      click(southWestId);
    }
    if (id.charAt(0) != "A") {
      let northId = String.fromCharCode(id.charCodeAt(0) - 1) + id.substring(1);
      click(northId);
    }
    if ((id.charAt(0) != "A") && (id.substring(1) != gridSize)) {
      let northEastId = String.fromCharCode(id.charCodeAt(0) - 1) + (parseInt(id.substring(1)) + 1);
      click(northEastId);
    }
    if ((id.charAt(0) != "A") && (id.substring(1) != 1)) {
      let northWestId = String.fromCharCode(id.charCodeAt(0) - 1) + (parseInt(id.substring(1)) - 1);
      click(northWestId);
    }
  }, 5)
}

function checkGameWon() {
  let pushedButtons = document.getElementsByClassName("pushed-button").length;
  if (gridSize * gridSize - pushedButtons === bombsNumber) {
    gameIsOver = true;
    document.getElementById("new-game").innerHTML = "<img src=\"Cool-face.png\"/>";
    clearInterval(timer);
  }
}