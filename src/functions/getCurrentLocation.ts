const getCurrentLocation: () => Promise<GeolocationPosition> = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve);
  });
};

export {getCurrentLocation};
