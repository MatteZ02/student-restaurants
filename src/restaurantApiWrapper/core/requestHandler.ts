import config from '../../config';

type Endpoint =
  | 'restaurants'
  | `restaurants/daily/${string}/${string}`
  | `restaurants/weekly/${string}/${string}`
  | `restaurants/daily/${string}/${string}/${string}`
  | `restaurants/weekly/${string}/${string}/${string}`
  | `restaurants/${string}`
  | 'users'
  | `users/${string}`
  | 'users/avatar'
  | 'auth/login';

class requestHandler {
  private static readonly _url = config.apiUrl;
  constructor() {}

  public static async get<T>(
    endpoint: Endpoint,
    headers: HeadersInit = {'Content-Type': 'application/json'}
  ): Promise<T> {
    const options = {
      method: 'GET',
      headers,
    };
    const restaurants = await this.fetch<T>(
      this._url + endpoint,
      options
    ).catch(err => {
      throw new Error(err);
    });
    return restaurants;
  }

  public static async post<T>(
    endpoint: Endpoint,
    body: any,
    headers: HeadersInit = {'Content-Type': 'application/json'}
  ): Promise<T> {
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
    const restaurants = await this.fetch<T>(
      this._url + endpoint,
      options
    ).catch(err => {
      throw new Error(err);
    });
    return restaurants;
  }

  public static async put<T>(
    endpoint: Endpoint,
    body: any,
    headers: HeadersInit = {'Content-Type': 'application/json'}
  ): Promise<T> {
    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    };
    const restaurants = await this.fetch<T>(
      this._url + endpoint,
      options
    ).catch(err => {
      throw new Error(err);
    });
    return restaurants;
  }

  public static async delete<T>(endpoint: Endpoint): Promise<T> {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const restaurants = await this.fetch<T>(
      this._url + endpoint,
      options
    ).catch(err => {
      throw new Error(err);
    });
    return restaurants;
  }

  private static async fetch<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const req = await fetch(url, options);
    if (req.status < 200 || req.status > 299)
      throw new Error(req.status.toString());

    const json = await req.json();

    return json;
  }
}

export default requestHandler;
