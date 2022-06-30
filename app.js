const Player = (name) => {
  const getName = () => name;
  return { getName };
};

const ai = (() => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  let aiDifficulty = 'easy';

  const setDifficulty = (difficulty) => (aiDifficulty = difficulty);
  const getCell = () => {
    let aiCell = null;
    switch (aiDifficulty) {
      case 'easy':
        for (let i = 0; aiCell === null && i < cells.length; i++) {
          if (cells[i].textContent === '') {
            aiCell = cells[i];
          }
        }

        break;
      case 'normal':
        break;
      case 'hard':
        break;
    }

    return aiCell;
  };

  return { setDifficulty, getCell };
})();

const gameboard = (() => {
  const cells = document.querySelectorAll('.cell');
  const playerTurn = document.getElementById('player-turn');

  let gameboardArr = ['', '', '', '', '', '', '', '', ''];
  let firstPlayer;
  let secondPlayer;
  let firstPlayerTurn = true;
  let cellsEnabled = true;

  const checkWinPattern = (piece) => {
    const winPatterns = {
      pattern1: [`${piece}`, `${piece}`, `${piece}`, '', '', '', '', '', ''],
      pattern2: ['', '', '', `${piece}`, `${piece}`, `${piece}`, '', '', ''],
      pattern3: ['', '', '', '', '', '', `${piece}`, `${piece}`, `${piece}`],
      pattern4: [`${piece}`, '', '', `${piece}`, '', '', `${piece}`, '', ''],
      pattern5: ['', `${piece}`, '', '', `${piece}`, '', '', `${piece}`, ''],
      pattern6: ['', '', `${piece}`, '', '', `${piece}`, '', '', `${piece}`],
      pattern7: [`${piece}`, '', '', '', `${piece}`, '', '', '', `${piece}`],
      pattern8: ['', '', `${piece}`, '', `${piece}`, '', `${piece}`, '', ''],
    };

    let checkCounter = 0;
    for (pattern in winPatterns) {
      for (let index = 0; index < gameboardArr.length; index++) {
        if (gameboardArr[index] === '') {
          continue;
        } else {
          if (winPatterns[pattern][index] === gameboardArr[index]) {
            checkCounter++;
          }
        }
      }

      if (checkCounter === 3) {
        return true;
      } else {
        checkCounter = 0;
      }
    }

    return false;
  };

  const isTie = () =>
    !Array.from(cells).some((cell) => cell.textContent === '');

  const updatePlayerTurn = () =>
    (playerTurn.textContent = firstPlayerTurn
      ? `IT'S ${firstPlayer.getName()} TURN!`
      : `IT'S ${secondPlayer.getName()} TURN!`);

  const toggleCellsEventListener = () => {
    let cellIndex = 0;
    cells.forEach((cell) => {
      if (cellsEnabled) {
        cell.removeEventListener('click', playRound);
      } else {
        cell.addEventListener('click', playRound);
      }

      cellIndex++;
    });

    cellsEnabled = !cellsEnabled;
  };

  const playRound = (e) => {
    let piece = firstPlayerTurn ? 'O' : 'X';
    let cell = e.target;
    const isCellEmpty = cell.textContent === '';

    cell.classList.toggle('selected');
    toggleCellsEventListener();
    setTimeout(() => {
      if (isCellEmpty) {
        cell.textContent = piece;
        gameboardArr[cell.dataset.index] = piece;
        if (checkWinPattern(piece)) {
          const winner = firstPlayerTurn
            ? firstPlayer.getName()
            : secondPlayer.getName();
          displayController.showEndGameModal(winner);
        } else if (isTie()) {
          displayController.showEndGameModal('tie');
        } else {
          firstPlayerTurn = !firstPlayerTurn;
          updatePlayerTurn();
        }
      }

      cell.classList.toggle('selected');

      // AI plays next round if it is the selected game mode
      if (gameOptionsForm.getGameMode() === 'ai' && isCellEmpty) {
        piece = firstPlayerTurn ? 'O' : 'X';
        cell = ai.getCell();

        setTimeout(() => {
          if (cell === null) {
            displayController.showEndGameModal('tie');
          } else {
            cell.classList.toggle('selected');

            cell.textContent = piece;
            gameboardArr[cell.dataset.index] = piece;

            if (checkWinPattern(piece)) {
              const winner = firstPlayerTurn
                ? firstPlayer.getName()
                : secondPlayer.getName();
              displayController.showEndGameModal(winner);
            } else if (isTie()) {
              displayController.showEndGameModal('tie');
            } else {
              firstPlayerTurn = !firstPlayerTurn;
              updatePlayerTurn();
            }
          }

          toggleCellsEventListener();
        }, 250);

        if (cell !== null) {
          cell.classList.toggle('selected');
        }
      } else {
        toggleCellsEventListener();
      }
    }, 250);
  };

  const startGameboard = () => {
    if (gameOptionsForm.getGameMode() === 'ai') {
      ai.setDifficulty(gameOptionsForm.getDifficulty());
    }

    firstPlayer = Player(gameOptionsForm.getFirstPlayerName());
    secondPlayer = Player(gameOptionsForm.getSecondPlayerName());

    let cellIndex = 0;
    cells.forEach((cell) => {
      // Set data link between cells and gameboardArr
      cell.dataset.index = cellIndex;
      cellIndex++;

      cell.addEventListener('click', playRound);
    });

    updatePlayerTurn();
  };

  const resetGameboard = () => {
    gameboardArr = ['', '', '', '', '', '', '', '', ''];
    cells.forEach((cell) => (cell.textContent = ''));
    firstPlayerTurn = true;
    updatePlayerTurn();
  };

  return { startGameboard, resetGameboard };
})();

const gameOptionsForm = (() => {
  const form = document.querySelector('.game-options-modal');

  const firstPlayerName = document.getElementById('player-1-name');
  const secondPlayerName = document.getElementById('player-2-name');

  const gameModeRadioBtns = document.querySelectorAll(
    'input[type="radio"][name="gamemode"]'
  );
  const difficultyRadioBtns = document.querySelectorAll(
    'input[type="radio"][name="difficulty"]'
  );

  const difficultyFieldset = document.getElementById('difficulty');

  // Disables form fields depending on selected game mode
  const changeDisabledFields = (radio) => {
    if (radio === 'pvp') {
      difficultyFieldset.disabled = true;
      secondPlayerName.value = '';
      secondPlayerName.disabled = false;
    } else {
      difficultyFieldset.disabled = false;
      secondPlayerName.value = 'AI';
      secondPlayerName.disabled = true;
    }
  };

  gameModeRadioBtns.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      changeDisabledFields(e.target.value);
    });

    radio.addEventListener('load', (e) => {
      changeDisabledFields(e.target.value);
    });
  });

  const getFirstPlayerName = () =>
    firstPlayerName.value === '' ? 'Player 1' : firstPlayerName.value;
  const getSecondPlayerName = () =>
    secondPlayerName.value === '' ? 'Player 2' : secondPlayerName.value;
  const getGameMode = () =>
    Array.from(gameModeRadioBtns).find((radioBtn) => radioBtn.checked === true)
      .value;
  const getDifficulty = () =>
    Array.from(difficultyRadioBtns).find(
      (radioBtn) => radioBtn.checked === true
    ).value;

  const areOptionsValid = () => form.checkValidity();

  return {
    getFirstPlayerName,
    getSecondPlayerName,
    getGameMode,
    getDifficulty,
    areOptionsValid,
  };
})();

const displayController = (() => {
  const startSection = document.querySelector('.start-section');
  const gameSection = document.querySelector('.game-section');

  const showGameOptionsBtn = document.getElementById('start-game');
  const startGameBtn = document.getElementById('go-btn');
  const resetBtn = document.getElementById('reset-btn');

  const gameOptionsModal = document.getElementById('game-options');
  const endGameModal = document.getElementById('end-game');

  const firstPlayerNameGameboard = document.getElementById(
    'player-1-name-gameboard'
  );
  const secondPlayerNameGameboard = document.getElementById(
    'player-2-name-gameboard'
  );

  const showGameOptionsModal = () => gameOptionsModal.classList.add('show');

  const showEndGameModal = (result) => {
    const resultModal = document.querySelector('.end-game-modal h2');

    if (result === 'tie') {
      resultModal.textContent = "IT'S A TIE";
    } else {
      resultModal.textContent = `${result} WINS!`;
    }

    endGameModal.classList.add('show');
  };

  const hideModals = () => {
    gameOptionsModal.classList.remove('show');
    endGameModal.classList.remove('show');
  };

  // Hide game options modal by clicking outside of it
  document.addEventListener('click', (e) => {
    if (e.target.id === 'game-options') {
      hideModals();
    }
  });

  const toggleGameboard = () => {
    if (startSection.style.display === 'none') {
      startSection.style.display = 'flex';
      gameSection.style.display = 'none';
    } else {
      startSection.style.display = 'none';
      gameSection.style.display = 'flex';
    }
  };

  const updateGameboardNames = () => {
    firstPlayerNameGameboard.textContent = gameOptionsForm.getFirstPlayerName();

    secondPlayerNameGameboard.textContent =
      gameOptionsForm.getSecondPlayerName();
  };

  const startGame = () => {
    if (gameOptionsForm.areOptionsValid()) {
      hideModals();
      toggleGameboard();
      updateGameboardNames();
      gameboard.startGameboard();
    }
  };

  showGameOptionsBtn.addEventListener('click', () =>
    showGameOptionsModal(gameOptionsModal)
  );

  startGameBtn.addEventListener('click', startGame);

  resetBtn.addEventListener('click', () => {
    hideModals();
    gameboard.resetGameboard();
  });

  return { showEndGameModal };
})();
