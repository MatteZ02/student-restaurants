import Restaurant, {RestaurantData, Restaurants} from './classes/Restaurant';
import User, {UserData} from './classes/User';
import requestHandler from './core/requestHandler';

interface LoginReturnData {
  message: string;
  token: string;
  user: UserData;
}

class RestaurantApiWrapper {
  constructor() {}

  public async getRestaurants(): Promise<Restaurants> {
    const restaurants =
      await requestHandler.get<RestaurantData[]>(`restaurants`);
    return restaurants.map<Restaurant>(
      restaurant => new Restaurant(restaurant)
    );
  }

  public async getRestaurant(id: string): Promise<Restaurant> {
    const restaurant = await requestHandler.get<RestaurantData>(
      `restaurants/${id}`
    );
    return new Restaurant(restaurant);
  }

  public async login(credentials: {
    username: string;
    password: string;
  }): Promise<User> {
    const loginData = await requestHandler.post<LoginReturnData>(
      'auth/login',
      credentials
    );
    return new User(loginData.user, loginData.token);
  }

  public async register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    const loginData = await requestHandler.post<Omit<LoginReturnData, 'token'>>(
      'users',
      credentials
    );
    return new User(loginData.user);
  }

  public async getUser(token: string) {
    const userData = await requestHandler.get<UserData>('users', {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return new User(userData, token);
  }
}

export default RestaurantApiWrapper;
