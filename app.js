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

  const toggleModal = (modal) =>
    modal.classList.toggle('show');

  const hideModals = () => {
    gameOptionsModal.classList.remove('show');
    endGameModal.classList.remove('show');
  };

  showGameOptionsBtn.addEventListener('click', () => toggleModal(gameOptionsModal));

  // Hide modals by clicking outside of them
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
      hideModals();
    }
  });
})();
