import {Restaurants} from '../restaurantApiWrapper/classes/Restaurant';

const filterRestaurants = (
  restaurants: Restaurants,
  filter: string
): Restaurants => {
  switch (filter) {
    case 'sodexo':
      return restaurants.filter(restaurant => restaurant.company === 'Sodexo');
    case 'compass':
      return restaurants.filter(
        restaurant => restaurant.company === 'Compass Group'
      );
    default:
      return restaurants;
  }
};

export {filterRestaurants};
