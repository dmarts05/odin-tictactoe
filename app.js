const Player = (name) => {
  let score = 0;
  const getScore = () => score;
  const setScore = (newScore) => (score = newScore);
  const getName = () => name;
  return { getName, getScore, setScore };
};

const gameboard = (() => {
  const cells = document.querySelectorAll('.cell');
  const playerTurn = document.getElementById('player-turn');

  const gameboardArr = ['', '', '', '', '', '', '', '', ''];
  let firstPlayer;
  let secondPlayer;
  let firstPlayerTurn = true;

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

  const updatePlayerTurn = () =>
    (playerTurn.textContent = firstPlayerTurn
      ? `It's ${firstPlayer.getName()} turn!`
      : `It's ${secondPlayer.getName()} turn!`);

  const playRound = (e) => {
    const piece = firstPlayerTurn ? 'O' : 'X';
    const cell = e.target;

    if (cell.textContent === '') {
      cell.textContent = piece;
      gameboardArr[cell.dataset.index] = piece;
      firstPlayerTurn = !firstPlayerTurn;
      if (checkWinPattern(piece)) {
        displayController.toggleModal(document.getElementById('end-game'));
      } else {
        updatePlayerTurn();
      }
    }
  };

  const startGameBoard = () => {
    firstPlayer = Player(gameOptionsForm.getFirstPlayerName());
    secondPlayer = Player(gameOptionsForm.getSecondPlayerName());

    let cellIndex = 0;
    cells.forEach((cell) => {
      // Set data link between cells and gameboardArr
      cell.dataset.index = cellIndex;
      cellIndex++;

      cell.addEventListener('click', playRound);
    });
  };

  return { gameboardArr, startGameBoard };
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
  gameModeRadioBtns.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'pvp') {
        difficultyFieldset.disabled = true;
        secondPlayerName.value = '';
        secondPlayerName.disabled = false;
      } else {
        difficultyFieldset.disabled = false;
        secondPlayerName.value = 'AI';
        secondPlayerName.disabled = true;
      }
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

  const gameOptionsModal = document.getElementById('game-options');
  const endGameModal = document.getElementById('end-game');

  const firstPlayerNameGameboard = document.getElementById(
    'player-1-name-gameboard'
  );
  const secondPlayerNameGameboard = document.getElementById(
    'player-2-name-gameboard'
  );

  const toggleModal = (modal) => modal.classList.toggle('show');

  const hideModals = () => {
    gameOptionsModal.classList.remove('show');
    endGameModal.classList.remove('show');
  };

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
      gameboard.startGameBoard();
    }
  };

  showGameOptionsBtn.addEventListener('click', () =>
    toggleModal(gameOptionsModal)
  );

  startGameBtn.addEventListener('click', startGame);

  // Hide modals by clicking outside of them
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
      hideModals();
    }
  });

  return { toggleModal };
})();
