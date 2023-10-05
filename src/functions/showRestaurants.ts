import * as leaflet from 'leaflet';
import {restaurantModalComponent} from '../components/restaurantModalComponent';
import {map, openDialog} from '../main';
import {Restaurant, User} from '../restaurantApiWrapper';
import {Restaurants} from '../restaurantApiWrapper/classes/Restaurant';
import {restaurantListComponent} from '../components/restaurantListComponent';

const marker_alt = new leaflet.Icon({
  iconUrl: '/icons/marker-alt.png',
});
const marker_default = new leaflet.Icon.Default();

const openRestaurantModal = (restaurant: Restaurant) => {
  const dialog = document.getElementById(
    'restaurantModal'
  ) as HTMLDialogElement;
  restaurantModalComponent(dialog, restaurant);
  openDialog(dialog);
};

const showRestaurants = (
  restaurants: Restaurants,
  location: GeolocationPosition,
  user: User | null = null
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

  if (user) {
    const favoriteRestaurant = restaurants.find(
      restaurant => restaurant._id === user.favouriteRestaurant
    );
    if (favoriteRestaurant) {
      const favoriteRestaurantIndex = restaurants.indexOf(favoriteRestaurant);
      restaurants.splice(favoriteRestaurantIndex, 1);
      restaurants.unshift(favoriteRestaurant);
    }
  }

  restaurants.forEach(restaurant => {
    const [longitude, latitude] = restaurant.location.coordinates;
    const marker = leaflet.marker([latitude, longitude]).addTo(map);
    marker.addEventListener('mouseover', () => {
      marker.bindPopup(restaurant.name).openPopup();
      const restaurantListElement = document.getElementById(restaurant._id);
      restaurantListElement?.classList.add('highlight');
      restaurantListElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
    marker.addEventListener('mouseout', () => {
      marker.closePopup();
      document.getElementById(restaurant._id)?.classList.remove('highlight');
    });
    marker.addEventListener('click', () => openRestaurantModal(restaurant));

    const restaurantListItem = restaurantListComponent(restaurant, user);
    restaurantListItem.addEventListener('click', () => {
      map.setView([latitude, longitude], 15);
      openRestaurantModal(restaurant);
    });
    restaurantListItem.addEventListener('mouseover', () =>
      marker.setIcon(marker_alt)
    );
    restaurantListItem.addEventListener('mouseout', () =>
      marker.setIcon(marker_default)
    );

    const restaurantList = document.getElementById('restaurantList');
    restaurantList?.appendChild(restaurantListItem);
  });
};

export {showRestaurants};
