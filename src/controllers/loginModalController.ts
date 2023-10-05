import {loggedIn, login} from '../functions/login';
import {closeDialog, openDialog} from '../main';

const loginModalController = (loginModal: HTMLDialogElement) => {
  const loginError = document.getElementById('loginError');
  const loginButton = document.getElementById('login');
  loginButton?.addEventListener('click', () => openDialog(loginModal));
  const loginModalCloseButton = document.getElementById(
    'loginModalClose'
  ) as HTMLButtonElement;
  loginModalCloseButton?.addEventListener('click', () =>
    closeDialog(loginModal)
  );
  const registerModalOpen = document.getElementById('register');
  registerModalOpen?.addEventListener('click', () => {
    const registerModal = document.getElementById(
      'registerModal'
    ) as HTMLDialogElement;
    closeDialog(loginModal);
    openDialog(registerModal);
  });
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = await login(new FormData(loginForm)).catch(err => {
      loginError?.classList.remove('hidden');
      console.error(err);
    });
    if (!user) return;
    closeDialog(loginModal);
    loggedIn(user);
    loginError?.classList.add('hidden');
  });
};

export {loginModalController};
