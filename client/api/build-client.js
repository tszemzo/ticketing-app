import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server!
    // Requests should be made to http://ingress-nginx.ingress-nginx....
    return axios.create({
      // This URL is going to be: http://SERVICENAME.NAMESPACE.svc.cluster.local
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // This will work as a Proxy sending all the headers we receive to the currentUser request
      headers: req.headers
    });
  } else {
    // We are on the browser!
    // requests can be made with a base of url ''
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;