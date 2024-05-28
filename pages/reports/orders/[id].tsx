import { useRouter } from 'next/router';

const OrderIndex = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Order Details</h1>
      <p>Details for order with ID: {id}</p>
    </div>
  );
}

export default OrderIndex;
