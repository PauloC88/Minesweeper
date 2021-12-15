let bombsNumber = 50;
const gridSize = 16; //number of buttons on each side of the square grid;
const array = Array.from(Array(gridSize * gridSize).keys());
let playArea = document.getElementById("play-area");
let flagsLeftBoard = document.getElementById("flags-left");

createGrid();

function createGrid() {
  flagsLeftBoard.innerHTML = "<b>Flags left: " + bombsNumber + "</b>";
  let width = gridSize * 30;
  playArea.style.width = width.toString() + "px";
  const buttonSize = "30px ";
  playArea.style.gridTemplateColumns = buttonSize.repeat(gridSize);
  for(let i = 0; i < gridSize * gridSize; ++i) {
    let gridButton = document.createElement("button");
    gridButton.setAttribute("type", "button");
    gridButton.classList.add("grid-button");
    gridButton.setAttribute("id", i);
    gridButton.onclick = function() {click(i);};
    gridButton.addEventListener("contextmenu", function(ev) {
                                                              ev.preventDefault();
                                                              flagButton(gridButton);
                                                              return false;
                                                            }, false);
    playArea.appendChild(gridButton);
  }

  const ArrayHalf1 = array.slice(0, gridSize * gridSize / 2);
  const ArrayHalf2 = array.slice(-gridSize * gridSize / 2);
  const bombsArrayH1 = ArrayHalf1.sort(() => 0.5 - Math.random()).slice(0, bombsNumber / 2);
  const bombsArrayH2 = ArrayHalf2.sort(() => 0.5 - Math.random()).slice(0, bombsNumber / 2);
  const bombsArray = bombsArrayH1.concat(bombsArrayH2);
  for(let id of bombsArray) {
    document.getElementById(id).classList.add("hidden-bombs");
  }
  let nearbyBombs = Array(gridSize * gridSize).fill(0);
  for (let id of bombsArray) {
    if (id === 0) {
      ++nearbyBombs[1];
      ++nearbyBombs[gridSize];
      ++nearbyBombs[gridSize + 1];
    } else if (id === gridSize - 1) {
      ++nearbyBombs[id - 1];
      ++nearbyBombs[id + gridSize - 1];
      ++nearbyBombs[id + gridSize];
    } else if (id === gridSize * (gridSize - 1)) {
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id - gridSize + 1];
      ++nearbyBombs[id + 1];
    } else if (id === gridSize * gridSize - 1) {
      ++nearbyBombs[id - gridSize - 1];
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id - 1];
    } else if (id < gridSize - 1) {
      ++nearbyBombs[id - 1];
      ++nearbyBombs[id + 1];
      ++nearbyBombs[id + gridSize - 1];
      ++nearbyBombs[id + gridSize];
      ++nearbyBombs[id + gridSize + 1];
    } else if (id > gridSize * (gridSize - 1)) {
      ++nearbyBombs[id - 1];
      ++nearbyBombs[id + 1];
      ++nearbyBombs[id - gridSize + 1];
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id - gridSize - 1];
    } else if (id % gridSize === 0) {
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id + gridSize];
      ++nearbyBombs[id - gridSize + 1];
      ++nearbyBombs[id + 1];
      ++nearbyBombs[id + gridSize + 1];
    } else if (id % gridSize === gridSize - 1) {
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id + gridSize];
      ++nearbyBombs[id + gridSize - 1];
      ++nearbyBombs[id - 1];
      ++nearbyBombs[id - gridSize - 1];
    } else {
      ++nearbyBombs[id - gridSize - 1];
      ++nearbyBombs[id - gridSize];
      ++nearbyBombs[id - gridSize + 1];
      ++nearbyBombs[id - 1];
      ++nearbyBombs[id + 1];
      ++nearbyBombs[id + gridSize - 1];
      ++nearbyBombs[id + gridSize];
      ++nearbyBombs[id + gridSize + 1];
    }
  }
  for(let i = 0; i < gridSize * gridSize; ++i) {
    let gridButton = document.getElementById(i);
    if (!gridButton.classList.contains("hidden-bombs")) {
      gridButton.setAttribute("data", nearbyBombs[i]);
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
    checkNearbyButtons(gridButton.id);
    checkGameWon();
  }
}

let flagsNumber = 0;

function flagButton(gridButton) {
  if(gameIsOver) {
    return;
  }
  if (flagsNumber < bombsNumber && !gridButton.classList.contains("pushed-button")) {
    let flagsLeft;
    if (!gridButton.classList.contains("flagged-button")) {
      gridButton.classList.add("flagged-button");
      ++flagsNumber;
      flagsLeft = bombsNumber - flagsNumber;
      flagsLeftBoard.innerHTML = "<b>Flags left: " + flagsLeft + "</b>";
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
  for(let bomb of bombs) {
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
    if (parseInt(id) === 0) {
      click(1);
      click(gridSize);
      click(gridSize + 1);
    } else if (parseInt(id) === gridSize - 1) {
      click(parseInt(id) - 1);
      click(parseInt(id) + gridSize - 1);
      click(parseInt(id) + gridSize);
    } else if (parseInt(id) === gridSize * (gridSize - 1)) {
      click(parseInt(id) - gridSize);
      click(parseInt(id) - gridSize + 1);
      click(parseInt(id) + 1);
    } else if (parseInt(id) === gridSize * gridSize - 1) {
      click(parseInt(id) - gridSize - 1);
      click(parseInt(id) - gridSize);
      click(parseInt(id) - 1);
    } else if (parseInt(id) < gridSize - 1) {
      click(parseInt(id) - 1);
      click(parseInt(id) + 1);
      click(parseInt(id) + gridSize - 1);
      click(parseInt(id) + gridSize);
      click(parseInt(id) + gridSize + 1);
    } else if (parseInt(id) > gridSize * (gridSize - 1)) {
      click(parseInt(id) - 1);
      click(parseInt(id) + 1);
      click(parseInt(id) - gridSize + 1);
      click(parseInt(id) - gridSize);
      click(parseInt(id) - gridSize - 1);
    } else if (parseInt(id) % gridSize === 0) {
      click(parseInt(id) - gridSize);
      click(parseInt(id) + gridSize);
      click(parseInt(id) - gridSize + 1);
      click(parseInt(id) + 1);
      click(parseInt(id) + gridSize + 1);
    } else if (parseInt(id) % gridSize === gridSize - 1) {
      click(parseInt(id) - gridSize);
      click(parseInt(id) + gridSize);
      click(parseInt(id) + gridSize - 1);
      click(parseInt(id) - 1);
      click(parseInt(id) - gridSize - 1);
    } else {
      click(parseInt(id) - gridSize - 1);
      click(parseInt(id) - gridSize);
      click(parseInt(id) - gridSize + 1);
      click(parseInt(id) - 1);
      click(parseInt(id) + 1);
      click(parseInt(id) + gridSize - 1);
      click(parseInt(id) + gridSize);
      click(parseInt(id) + gridSize + 1);
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