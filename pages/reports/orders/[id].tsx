import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "contexts";
import { getOrder } from "lib/actions/orders";
import { getSession } from "next-auth/react";

const OrderIndex = () => {
  const router = useRouter();
  const api = useContext(ApiContext);
  const { id } = router.query;

  const fetchOrder = async (id) => {
    console.log('inside fetch orderrrrrrrrr')
    const session = await getSession();
    console.log('Session in fetchOrder:', session);
    const response = await fetch(`/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    });
    console.log('fetchOrder response:', response);
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }
    const data = await response.json();
    return data.order;
  };

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
    retry: false,
  });

  // console.log({ order, orderError, orderLoading });

  return (
    <div>
      <h1>Order Details</h1>
      <p>Details for order with ID: {id}</p>
    </div>
  );
};

export default OrderIndex;
