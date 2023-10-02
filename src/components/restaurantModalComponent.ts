import {closeDialog} from '../main';
import {Restaurant} from '../restaurantApiWrapper';

const showDailyMeny = async (
  menu: HTMLUListElement,
  restaurant: Restaurant
): Promise<HTMLUListElement> => {
  menu.innerHTML = '';
  const dailyMenu = await restaurant.getDailyMenu();
  dailyMenu.courses.forEach(course => {
    const courseElement = document.createElement('li');
    const courseName = document.createElement('h4');
    courseName.innerText = course.name;
    const coursePrice = document.createElement('p');
    coursePrice.innerText = course.price ?? 'Price not available';
    courseElement.appendChild(courseName);
    courseElement.appendChild(coursePrice);
    menu.appendChild(courseElement);
  });
  return menu;
};

const showWeeklyMeny = async (
  menu: HTMLUListElement,
  restaurant: Restaurant
): Promise<HTMLUListElement> => {
  menu.innerHTML = '';
  const weeklyMenu = await restaurant.getWeeklyMenu();
  weeklyMenu.days.forEach(day => {
    const dayElement = document.createElement('li');
    const dayName = document.createElement('h3');
    dayName.innerText = day.date;
    dayElement.appendChild(dayName);
    day.courses.forEach(course => {
      const courseElement = document.createElement('li');
      const courseName = document.createElement('h4');
      courseName.innerText = course.name;
      const coursePrice = document.createElement('p');
      coursePrice.innerText = course.price ?? 'Price not available';
      courseElement.appendChild(courseName);
      courseElement.appendChild(coursePrice);
      dayElement.appendChild(courseElement);
    });
    menu.appendChild(dayElement);
  });
  return menu;
};

const restaurantModalComponent = (
  dialog: HTMLDialogElement,
  restaurant: Restaurant
): HTMLDialogElement => {
  const name = document.createElement('h2');
  name.innerText = restaurant.name;
  const address = document.createElement('h3');
  address.innerText = restaurant.address;
  const dailyMenuBtn = document.createElement('button');
  dailyMenuBtn.innerText = 'Daily Menu';
  const weeklyMenuBtn = document.createElement('button');
  weeklyMenuBtn.innerText = 'Weekly Menu';
  const menu = document.createElement('ul');
  showDailyMeny(menu, restaurant);

  dailyMenuBtn.addEventListener('click', async () =>
    showDailyMeny(menu, restaurant)
  );
  weeklyMenuBtn.addEventListener('click', async () =>
    showWeeklyMeny(menu, restaurant)
  );

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.addEventListener('click', () => closeDialog(dialog));

  dialog.appendChild(name);
  dialog.appendChild(address);
  dialog.appendChild(dailyMenuBtn);
  dialog.appendChild(weeklyMenuBtn);
  dialog.appendChild(menu);
  dialog.appendChild(closeButton);

  return dialog;
};

export {restaurantModalComponent};
