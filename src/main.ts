import * as leaflet from 'leaflet';
import RestaurantApiWrapper, {Restaurant, User} from './restaurantApiWrapper';
import {getCurrentLocation} from './functions/getCurrentLocation';
import {restaurantTableRowComponent} from './components/restaurantTableRowComponent';
import {restaurantModalComponent} from './components/restaurantModalComponent';
import {filterRestaurants} from './functions/filterRestaurants';
import {Restaurants} from './restaurantApiWrapper/classes/Restaurant';
import {loggedIn, login} from './functions/login';

const restaurantApiWrapper = new RestaurantApiWrapper();
const map = leaflet.map('map');
const marker_alt = new leaflet.Icon({
  iconUrl: '/icons/marker-alt.png',
});
const marker_default = new leaflet.Icon.Default();

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

const openRestaurantModal = (restaurant: Restaurant) => {
  const dialog = document.getElementById(
    'restaurantModal'
  ) as HTMLDialogElement;
  restaurantModalComponent(dialog, restaurant);
  openDialog(dialog);
};

const showRestaurants = (
  restaurants: Restaurants,
  location: GeolocationPosition
) => {
  const {latitude, longitude} = location.coords;

  restaurants.sort((a, b) => {
    const aDistance = leaflet
      .latLng(latitude, longitude)
      .distanceTo(
        leaflet.latLng(a.location.coordinates[1], a.location.coordinates[0])
      );
    const bDistance = leaflet
      .latLng(latitude, longitude)
      .distanceTo(
        leaflet.latLng(b.location.coordinates[1], b.location.coordinates[0])
      );
    return aDistance - bDistance;
  });

  restaurants.forEach(restaurant => {
    const [longitude, latitude] = restaurant.location.coordinates;
    const marker = leaflet.marker([latitude, longitude]).addTo(map);
    marker.addEventListener('mouseover', () => {
      marker.bindPopup(restaurant.name).openPopup();
      const restaurantTableRowElement = document.getElementById(restaurant._id);
      restaurantTableRowElement?.classList.add('highlight');
      restaurantTableRowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
    marker.addEventListener('mouseout', () => {
      marker.closePopup();
      document.getElementById(restaurant._id)?.classList.remove('highlight');
    });
    marker.addEventListener('click', () => {
      openRestaurantModal(restaurant);
    });

    const restaurantTableRow = restaurantTableRowComponent(restaurant);
    restaurantTableRow.addEventListener('click', () => {
      map.setView([latitude, longitude], 15);
      openRestaurantModal(restaurant);
    });
    restaurantTableRow.addEventListener('mouseover', () =>
      marker.setIcon(marker_alt)
    );
    restaurantTableRow.addEventListener('mouseout', () =>
      marker.setIcon(marker_default)
    );

    const restaurantList = document.getElementById('restaurantList');
    restaurantList?.appendChild(restaurantTableRow);
  });
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
      location
    );
  });
  showRestaurants(restaurants, location);
})();

// Modals
const restaurantModal = document.getElementById(
  'restaurantModal'
) as HTMLDialogElement;
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

const loginModal = document.getElementById('loginModal') as HTMLDialogElement;
const loginButton = document.getElementById('login');
loginButton?.addEventListener('click', () => openDialog(loginModal));
const loginModalCloseButton = document.getElementById(
  'loginModalClose'
) as HTMLButtonElement;
loginModalCloseButton?.addEventListener('click', () => closeDialog(loginModal));
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const user = await login(new FormData(loginForm)).catch(err => {
    const loginError = document.getElementById('loginError');
    loginError?.classList.remove('hidden');
    console.error(err);
  });
  if (!user) return;
  closeDialog(loginModal);
  loggedIn(user);
});

export {openDialog, closeDialog, restaurantApiWrapper};
