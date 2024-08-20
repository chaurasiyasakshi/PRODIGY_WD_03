let gameboard = document.getElementById('gameboard');
let boxes = gameboard.children;
let message = document.querySelector('.message');
let playWithAiButton = document.getElementById('play-with-ai');
let playWithFriendButton = document.getElementById('play-with-friend');
let currentPlayer = 'X';
let aiPlayer = 'O';
let gameOver = false;
let moves = 0;

playWithAiButton.addEventListener('click', playWithAi);
playWithFriendButton.addEventListener('click', playWithFriend);

function restartGame() {
  location.reload();
}

function playWithAi() {
  currentPlayer = 'X';
  aiPlayer = 'O';
  gameOver = false;
  clearBoard();
  message.textContent = 'Your turn!';
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function() {
      if (!gameOver) {
        makeMove(i, currentPlayer);
        moves++;
        if (checkWin(currentPlayer)) {
          gameOver = true;
          message.textContent = 'You win!';
          setTimeout(restartGame, 1000);
        } else if (moves == 9) {
          message.textContent = 'It is a Tie';
          setTimeout(restartGame, 1000);
        } else {
          makeAiMove();
          moves++;
        }
      }
    });
  }
}

function playWithFriend() {
  currentPlayer = 'X';
  gameOver = false;
  clearBoard();
  message.textContent = 'Player X\'s turn!';
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function() {
      if (!gameOver) {
        makeMove(i, currentPlayer);
        moves++;
        if (checkWin(currentPlayer)) {
          gameOver = true;
          message.textContent = 'Player ' + currentPlayer + ' wins!';
          setTimeout(restartGame, 1000);
        } else if (moves == 9) {
          message.textContent = 'It is a Tie';
          setTimeout(restartGame, 1000);
        } else {
          currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
          message.textContent = 'Player ' + currentPlayer + '\'s turn!';
        }
      }
    });
  }
}

function makeMove(index, player) {
  boxes[index].textContent = player;
  boxes[index].removeEventListener('click', function(){});
}

function checkWin(player) {
  let winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winConditions.length; i++) {
    let condition = winConditions[i];
    if (boxes[condition[0]].textContent === player && boxes[condition[1]].textContent === player && boxes[condition[2]].textContent === player) {
      return true;
    }
  }
  return false;
}

function clearBoard() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].textContent = '';
    boxes[i].addEventListener('click', function(){});
  }
}

function makeAiMove() {
  let bestScore = -Infinity;
  let move;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (boxes[i*3 + j].textContent === '') {
        boxes[i*3 + j].textContent = aiPlayer;
        let score = minimax(0, false);
        boxes[i*3 + j].textContent = '';
        if (score > bestScore) {
          bestScore = score;
          move = {i, j};
        }
      }
    }
  }
  boxes[move.i*3 + move.j].textContent = aiPlayer;
  
  if (checkWin(aiPlayer)) {
    gameOver = true;
    message.textContent = 'AI wins!';
    setTimeout(restartGame, 1000);
  }
  
}


function minimax(depth, isMaximizing) {
    let result = checkWin(currentPlayer);
    if (result !== null) {
      return (result === 'X') ? -1 : 1;
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boxes[i*3 + j].textContent === '') {
            boxes[i*3 + j].textContent = aiPlayer;
            let score = minimax(depth + 1, false);
            boxes[i*3 + j].textContent = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boxes[i*3 + j].textContent === '') {
            boxes[i*3 + j].textContent = currentPlayer;
            let score = minimax(depth + 1, true);
            boxes[i*3 + j].textContent = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }