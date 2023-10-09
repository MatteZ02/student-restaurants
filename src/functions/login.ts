import config from '../config';
import {openDialog, restaurantApiWrapper} from '../main';
import {User} from '../restaurantApiWrapper';

const login = async (formData: FormData): Promise<User> => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const user = await restaurantApiWrapper
    .login({username, password})
    .catch(err => {
      throw new Error(err.message);
    });
  return user;
};

const loggedIn = async (user: User) => {
  if (user.token) localStorage.setItem('token', user.token);
  const loginButton = document.getElementById('login');
  loginButton?.classList.add('hidden');
  const logoutButton = document.getElementById('logout');
  logoutButton?.classList.remove('hidden');
  const avatar = document.getElementById('avatar') as HTMLImageElement;
  avatar.src = user.avatar
    ? config.uploadUrl + user.avatar
    : '/img/avatar_placeholder.png';
  avatar?.classList.remove('hidden');
  avatar.addEventListener('click', () =>
    openDialog(document.getElementById('userModal') as HTMLDialogElement)
  );
  const username = document.getElementById('username');
  username!.innerText = user.username;
  username?.classList.remove('hidden');

  logoutButton?.addEventListener('click', () => {
    logoutButton?.classList.add('hidden');
    loginButton?.classList.remove('hidden');
    avatar?.classList.add('hidden');
    username?.classList.add('hidden');
    localStorage.removeItem('token');
  });
};

export {login, loggedIn};
