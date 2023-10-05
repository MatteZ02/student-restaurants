import {Restaurant} from '../restaurantApiWrapper';

const restaurantTableRowComponent = (restaurant: Restaurant): HTMLElement => {
  const restaurantItem = document.createElement('div');
  restaurantItem.classList.add('restaurant');
  restaurantItem.setAttribute('id', restaurant._id);
  const content = document.createElement('div');
  content.classList.add('content');
  const name = document.createElement('h3');
  const address = document.createElement('h4');
  const favorite = document.createElement('span');
  favorite.classList.add('material-symbols-outlined');
  favorite.innerText = 'star';
  name.innerText = restaurant.name;
  address.innerText = restaurant.address;
  content.appendChild(name);
  content.appendChild(address);
  restaurantItem.appendChild(content);
  restaurantItem.appendChild(favorite);
  return restaurantItem;
};

export {restaurantTableRowComponent};
