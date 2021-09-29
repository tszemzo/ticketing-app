import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get('/api/users/currentUser').catch((err) => {
    console.log(err.message);
  });
 
  return <h1>Landing Page</h1>;
};

// If we ever want to fetch some data with NextJS during the server side rendering process:
// we are going to define this getInitialProps function. Here we can make any async request,
// generate data, whatever we need to do to fetch data, will be inside here. This will be executed
// on the server.
// LandingPage.getInitialProps = async () => {
//   const response = await axios.get('/api/get/currentUser');
//   console.log('Im on the server');

  // This object will show up as props to LandingPage component above
//   return response.data;
// };

export default LandingPage;