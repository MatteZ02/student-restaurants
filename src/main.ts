import * as leaflet from 'leaflet';
import RestaurantApiWrapper, {User} from './restaurantApiWrapper';
import {getCurrentLocation} from './functions/getCurrentLocation';
import {filterRestaurants} from './functions/filterRestaurants';
import {loggedIn} from './functions/login';
import config from './config';
import {showRestaurants} from './functions/showRestaurants';
import {loginModalController} from './controllers/loginModalController';
import {restaurantModalController} from './controllers/restaurantModalController';
import {registerModalController} from './controllers/registerModalController';
import {userModalController} from './controllers/userModalController';

const restaurantApiWrapper = new RestaurantApiWrapper();
const map = leaflet.map('map');
const theme = localStorage.getItem('theme');
if (!theme) localStorage.setItem('theme', 'light');
const themeButton = document.getElementById('theme') as HTMLButtonElement;
themeButton.innerText = theme === 'dark' ? 'light_mode' : 'dark_mode';
if (theme === 'dark')
  document.documentElement.setAttribute('data-theme', 'dark');

const toggleTheme = () => {
  const theme = localStorage.getItem('theme');
  switch (theme) {
    case 'light':
      themeButton.innerText = 'light_mode';
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      break;
    case 'dark':
      themeButton.innerText = 'dark_mode';
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      break;
  }
};

document.getElementById('theme')?.addEventListener('click', toggleTheme);

const trapFocus = (e: KeyboardEvent, dialog: HTMLDialogElement) => {
  const elements = dialog.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];
  if (e.key === 'Tab') {
    const tabForwards = !e.shiftKey && document.activeElement === lastElement;
    const tabBackwards = e.shiftKey && document.activeElement === firstElement;
    if (tabForwards) {
      e.preventDefault();
      firstElement.focus();
    } else if (tabBackwards) {
      e.preventDefault();
      lastElement.focus();
    }
  }
};

const openDialog = (dialog: HTMLDialogElement) => {
  dialog.showModal();
  dialog.addEventListener('keydown', e => trapFocus(e, dialog));
};

const closeDialog = (dialog: HTMLDialogElement) => {
  dialog.close();
  dialog.removeEventListener('keydown', e => trapFocus(e, dialog));
};

leaflet
  .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  })
  .addTo(map);

(async () => {
  let user: User | null = null;
  if (localStorage.getItem('token')) {
    const getUser = await restaurantApiWrapper
      .getUser(localStorage.getItem('token') as string)
      .catch(() => {});
    if (getUser) loggedIn(getUser);
    user = getUser ?? null;
  }

  const restaurants = await restaurantApiWrapper.getRestaurants();
  const location = await getCurrentLocation();
  const {latitude, longitude} = location.coords;
  map.setView([latitude, longitude], 10);

  if (user) {
    const avatar = document.getElementById('avatar') as HTMLImageElement;
    if (!avatar) return;
    avatar.classList.remove('hidden');
    avatar.src = config.uploadUrl + user.avatar;
    avatar.addEventListener('click', () =>
      openDialog(document.getElementById('userModal') as HTMLDialogElement)
    );
    const username = document.getElementById('username');
    if (!username) return;
    username.classList.remove('hidden');
    username.innerText = user.username;
  }

  const filter = document.getElementById('filter') as
    | HTMLSelectElement
    | undefined;

  filter?.addEventListener('change', () => {
    const restaurantList = document.getElementById('restaurantList');
    if (!restaurantList) return;
    restaurantList.innerHTML = '';
    map.eachLayer(layer => {
      if (layer instanceof leaflet.Marker) map.removeLayer(layer);
    });
    showRestaurants(
      filterRestaurants(restaurants, filter?.value ?? 'none'),
      location,
      user
    );
  });
  showRestaurants(restaurants, location, user);
})();

// modals
const restaurantModal = document.getElementById(
  'restaurantModal'
) as HTMLDialogElement;
restaurantModalController(restaurantModal);
const loginModal = document.getElementById('loginModal') as HTMLDialogElement;
loginModalController(loginModal);
const registerModal = document.getElementById(
  'registerModal'
) as HTMLDialogElement;
registerModalController(registerModal);
const userModal = document.getElementById('userModal') as HTMLDialogElement;
userModalController(userModal);

export {openDialog, closeDialog, restaurantApiWrapper, map};
