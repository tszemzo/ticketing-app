import 'bootstrap/dist/css/bootstrap.css';

// Kind of a wrapper of every component we are going to show on the screen
const ComponentWrapper = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
};

export default ComponentWrapper;