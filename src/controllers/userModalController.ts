import {loggedIn} from '../functions/login';
import {restaurantApiWrapper} from '../main';

const userModalController = async (userModal: HTMLDialogElement) => {
  const user = await restaurantApiWrapper.getUser(
    localStorage.getItem('token') ?? ''
  );
  const userForm = userModal.querySelector('form') as HTMLFormElement;
  userForm.username.value = user.username;
  userForm.email.value = user.email;

  userForm.addEventListener('submit', async event => {
    event.preventDefault();
    const error = document.getElementById('updateError');
    const formData = new FormData(userForm);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const avatar = formData.get('avatar') as File | null;
    const updatedUser = await user
      .update({
        username: username !== user.username ? username : undefined,
        email: email !== user.email ? email : undefined,
      })
      .catch(err => {
        if (!error) return;
        const errorText = error.querySelector('p');
        if (!errorText) return;
        errorText.innerText = err.message;
        error.classList.remove('hidden');
      });
    if (!!avatar?.size) user.uploadAvatar(avatar);
    if (user.token) localStorage.setItem('token', user.token);
    if (updatedUser) {
      loggedIn(updatedUser);
      userModal.close();
      error?.classList.add('hidden');
    }
  });
};

export {userModalController};
