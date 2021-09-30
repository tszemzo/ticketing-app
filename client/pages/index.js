import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h1>You are {currentUser ? null : 'not'} signed in</h1>;
};

// If we ever want to fetch some data with NextJS during the server side rendering process:
// we are going to define this getInitialProps function. Here we can make any async request,
// generate data, whatever we need to do to fetch data, will be inside here. This will be executed
// on the server.
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentUser');
  // This object will show up as props to LandingPage component above
  return data;
};

export default LandingPage;