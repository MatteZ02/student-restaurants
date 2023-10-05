import {restaurantApiWrapper} from '../main';
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
  const avatarButton = document.getElementById('avatar');
  avatarButton?.classList.remove('hidden');

  logoutButton?.addEventListener('click', () => {
    logoutButton?.classList.add('hidden');
    loginButton?.classList.remove('hidden');
    avatarButton?.classList.add('hidden');
    localStorage.removeItem('token');
  });
};

export {login, loggedIn};
