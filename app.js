const Player = (name) => {
  let score = 0;
  const getScore = () => score;
  const setScore = (newScore) => (score = newScore);
  const getName = () => name;
  return { getName, getScore, setScore };
};

const gameboard = (() => {
  let player1;
  let player2;

  const startGameBoard = () => {
    player1 = Player(gameOptionsForm.getFirstPlayerName);
    player2 = Player(gameOptionsForm.getSecondPlayerName);
  };
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

  const getFirstPlayerName = () => firstPlayerName.value;
  const getSecondPlayerName = () => secondPlayerName.value;
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
    firstPlayerNameGameboard.textContent =
      gameOptionsForm.getFirstPlayerName() === ''
        ? 'Player 1'
        : gameOptionsForm.getFirstPlayerName();

    secondPlayerNameGameboard.textContent =
      gameOptionsForm.getSecondPlayerName() === ''
        ? 'Player 2'
        : gameOptionsForm.getSecondPlayerName();
  };

  const startGame = () => {
    if (gameOptionsForm.areOptionsValid()) {
      hideModals();
      toggleGameboard();
      updateGameboardNames();
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
})();
