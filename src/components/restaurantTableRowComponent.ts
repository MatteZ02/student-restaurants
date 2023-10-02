import {Restaurant} from '../restaurantApiWrapper';

const restaurantTableRowComponent = (
  restaurant: Restaurant
): HTMLTableRowElement => {
  const tr = document.createElement('tr');
  tr.setAttribute('id', restaurant._id);
  const td = document.createElement('td');
  const name = document.createElement('h3');
  const address = document.createElement('h4');
  name.innerText = restaurant.name;
  address.innerText = restaurant.address;
  td.appendChild(name);
  td.appendChild(address);
  tr.appendChild(td);
  return tr;
};

export {restaurantTableRowComponent};
