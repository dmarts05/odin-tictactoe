// const Player = (name) => {
//   let score = 0;
//   const getScore = () => score;
//   const setScore = (newScore) => score = newScore;
//   const getName = () => name;
//   return {getName, getScore, setScore};
// };

const displayController = (() => {
  const showGameOptionsBtn = document.getElementById('start-game');
  const gameOptionsModal = document.getElementById('game-options');
  const endGameModal = document.getElementById('end-game');

  const toggleModal = (modal) => modal.classList.toggle('show');

  const hideModals = () => {
    gameOptionsModal.classList.remove('show');
    endGameModal.classList.remove('show');
  };

  showGameOptionsBtn.addEventListener('click', () =>
    toggleModal(gameOptionsModal)
  );

  // Hide modals by clicking outside of them
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
      hideModals();
    }
  });

  return { toggleModal, hideModals };
})();

const gameOptionsForm = (() => {
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

  return {
    getFirstPlayerName,
    getSecondPlayerName,
    getGameMode,
    getDifficulty,
  };
})();
