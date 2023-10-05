import {loggedIn} from '../functions/login';
import {register} from '../functions/register';
import {closeDialog} from '../main';

const registerModalController = (registerModal: HTMLDialogElement) => {
  const registerModalCloseButton = document.getElementById(
    'registerModalClose'
  ) as HTMLButtonElement;
  registerModalCloseButton?.addEventListener('click', () =>
    closeDialog(registerModal)
  );
  const registerForm = document.getElementById(
    'registerForm'
  ) as HTMLFormElement;
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = await register(new FormData(registerForm)).catch(err => {
      const error = document.getElementById('registerError');
      if (!error) return;
      const errorText = error.querySelector('p');
      if (!errorText) return;
      errorText.innerText = err.message;
      error.classList.remove('hidden');
    });
    if (!user) return;
    closeDialog(registerModal);
    loggedIn(user);
  });
};

export {registerModalController};
