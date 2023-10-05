import {closeDialog} from '../main';

const restaurantModalController = (restaurantModal: HTMLDialogElement) => {
  restaurantModal.addEventListener(
    'close',
    () => (restaurantModal.innerHTML = '')
  );
  const restaurantModalCloseButton = document.getElementById(
    'restaurantModalClose'
  );
  restaurantModalCloseButton?.addEventListener('click', () => {
    if (!restaurantModal) return;
    closeDialog(restaurantModal);
  });
};

export {restaurantModalController};
