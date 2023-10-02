import requestHandler from '../core/requestHandler';

export interface UserData {
  _id: string;
  username: string;
  email: string;
  favouriteRestaurant: string;
  avatar: string;
  role: 'admin' | 'user';
}

class User implements UserData {
  public readonly _id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly favouriteRestaurant: string;
  public readonly avatar: string;
  public readonly role: 'admin' | 'user';
  constructor(
    userData: UserData,
    private readonly token?: string
  ) {
    this._id = userData._id;
    this.username = userData.username;
    this.email = userData.email;
    this.favouriteRestaurant = userData.favouriteRestaurant;
    this.avatar = userData.avatar;
    this.role = userData.role;
  }

  public async update(data: Partial<UserData>): Promise<User> {
    const user = await requestHandler.put<UserData>(`users`, data, {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return new User(user);
  }

  public async delete(): Promise<UserData> {
    const req = await requestHandler.delete<{
      message: string;
      data: UserData;
    }>(`users`);
    return req.data;
  }

  public async uploadAvatar(file: File): Promise<UserData> {
    const formData = new FormData();
    formData.append('avatar', file);
    const req = await requestHandler.post<{
      message: string;
      data: UserData;
    }>(`users/avatar`, formData, {
      Authorization: `Bearer ${this.token}`,
    });
    return req.data;
  }
}

export default User;
