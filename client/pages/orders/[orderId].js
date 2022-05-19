import { useEffect, useState } from "react";
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // Just for the first time run, then it runs every second.
    const timerId = setInterval(findTimeLeft, 1000); // Call this function every second

    // Runs when you get out from this component or re-renders (when you have any dependency on the array, none in this case)
    return () => {
      clearInterval(timerId);
    }
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout 
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51KwJr2KUpyQttnLD5mZcMIJCgEdWAqY4MJARaBKyHJYUHHEzbb5QID87XvUvUXsKXaE5obc3XahRGMKXYaMF5cUb00Bc2FA5gY"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>;
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  
  return { order: data };
}

export default OrderShow;
