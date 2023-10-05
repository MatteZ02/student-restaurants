import {favoriteRestaurant} from '../functions/favoriteRestaurant';
import {Restaurant, User} from '../restaurantApiWrapper';

const restaurantListComponent = (
  restaurant: Restaurant,
  user: User | null = null
): HTMLElement => {
  const restaurantItem = document.createElement('div');
  restaurantItem.classList.add('restaurant');
  restaurantItem.setAttribute('id', restaurant._id);
  const content = document.createElement('div');
  content.classList.add('content');
  const name = document.createElement('h3');
  const address = document.createElement('h4');
  const favorite = document.createElement('span');
  favorite.classList.add('material-symbols-outlined');
  favorite.addEventListener('click', () => favoriteRestaurant(restaurant));
  favorite.innerText = 'star';
  if (user?.favouriteRestaurant === restaurant._id)
    restaurantItem.classList.add('favorite');
  name.innerText = restaurant.name;
  address.innerText = restaurant.address;
  content.appendChild(name);
  content.appendChild(address);
  restaurantItem.appendChild(content);
  restaurantItem.appendChild(favorite);
  return restaurantItem;
};

export {restaurantListComponent};
