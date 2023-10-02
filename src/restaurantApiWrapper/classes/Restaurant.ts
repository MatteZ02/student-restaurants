import requestHandler from '../core/requestHandler';

export interface RestaurantData {
  _id: string;
  companyId: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  location: {
    type: 'point';
    coordinates: [number, number];
  };
  company: 'Sodexo' | 'Compass Group';
}

interface Course {
  name: string;
  price: string | undefined;
  diets: string[];
}

interface Menu {
  date: string;
  courses: Course[];
}

export type DailyMenu = Omit<Menu, 'date'>;

export interface WeeklyMenu {
  days: Menu[];
}

class Restaurant implements RestaurantData {
  public readonly _id: string;
  public readonly companyId: number;
  public readonly name: string;
  public readonly address: string;
  public readonly postalCode: string;
  public readonly city: string;
  public readonly phone: string;
  public readonly location: {
    type: 'point';
    coordinates: [number, number];
  };
  public readonly company: 'Sodexo' | 'Compass Group';

  constructor(restaurantData: RestaurantData) {
    this._id = restaurantData._id;
    this.companyId = restaurantData.companyId;
    this.name = restaurantData.name;
    this.address = restaurantData.address;
    this.postalCode = restaurantData.postalCode;
    this.city = restaurantData.city;
    this.phone = restaurantData.phone;
    this.location = restaurantData.location;
    this.company = restaurantData.company;
  }

  public async getDailyMenu(lang: 'en' | 'fi' = 'fi'): Promise<DailyMenu> {
    const dailyMenu = await requestHandler.get<DailyMenu>(
      `restaurants/daily/${this._id}/${lang}`
    );
    return dailyMenu;
  }

  public async getWeeklyMenu(lang: 'en' | 'fi' = 'fi'): Promise<WeeklyMenu> {
    const weeklyMenu = await requestHandler.get<WeeklyMenu>(
      `restaurants/weekly/${this._id}/${lang}`
    );
    return weeklyMenu;
  }
}

export default Restaurant;
export type Restaurants = Restaurant[];
