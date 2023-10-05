import {restaurantApiWrapper} from '../main';
import {User} from '../restaurantApiWrapper';

const register = async (FormData: FormData): Promise<User> => {
  const username = FormData.get('username') as string;
  const email = FormData.get('email') as string;
  const password = FormData.get('password') as string;
  const res = await restaurantApiWrapper
    .register({username, email, password})
    .catch(err => {
      throw new Error(err.message);
    });
  window.open(res.activationUrl, '_blank');
  return res.user;
};

export {register};
