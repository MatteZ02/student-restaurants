import RestaurantApiWrapper from './restaurantApiWrapper';

const restaurantApiWrapper = new RestaurantApiWrapper();
restaurantApiWrapper.getRestaurants().then(restaurants => {
  console.log(restaurants[0]);
});
