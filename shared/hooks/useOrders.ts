import { useEffect, useState } from 'react';

import useApi from './useApi';
import { getOrders } from '@lib/actions/orders';

function useOrders(props, pageIndex = 0) {
  const api = useApi();
  const { type, entity } = props;
  const [orders, setOrders] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [ordersError, setOrdersError] = useState();
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchData = ({ pageIndex }) => {
    setOrdersLoading(true);
    setOrders([]);
    entity &&
      !ordersLoading &&
      getOrders(api, entity, type, pageIndex)
        .then((res) => {
          setOrders(res?.data?.data?.map((o) => o.attributes));
          setPageCount(res.data.metadata.total_pages);
        })
        .finally(() => setOrdersLoading(false))
        .catch((err) => {
          console.log('An error occurred when trying to GET orders.', err);
          setOrdersError(err);
        });
  };

  useEffect(() => {
    if (entity && !ordersLoading) {
      fetchData({ pageIndex });
    }
  }, [entity]);

  return { orders, ordersLoading, ordersError, pageCount, fetchData };
}

export default useOrders;
