module.exports = {
  // Added to update next all the time, as sometimes it doesn't update when running next with Docker
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
};