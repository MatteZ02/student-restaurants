import {restaurantApiWrapper} from '../main';
import {Restaurant} from '../restaurantApiWrapper';

const favoriteRestaurant = async (restarant: Restaurant) => {
  const user = await restaurantApiWrapper.getUser(
    localStorage.getItem('token') as string
  );
  if (user.favouriteRestaurant === restarant._id) return;
  document.querySelector('.favorite')?.classList.remove('favorite');
  document.getElementById(restarant._id)?.classList.add('favorite');
  user.update({favouriteRestaurant: restarant._id});
};

export {favoriteRestaurant};
