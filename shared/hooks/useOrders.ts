import { useEffect, useState } from 'react';

import { getOrders } from '@lib/actions/orders';
import OrderRecord from '@lib/records/order';
import useApi from './useApi';

function useOrders(props, pageIndex = 0, depsLoading = false, shouldFetch = false) {
  const api = useApi();
  const { type, entity } = props;
  const [orders, setOrders] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [ordersError, setOrdersError] = useState();
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchData = ({ pageIndex }) => {
    setOrdersLoading(true);
    setOrders([]);
    getOrders(api, entity, type, pageIndex)
      .then((res) => {
        setOrders(res?.data?.data?.map((o) => new OrderRecord(o.attributes)));
        setPageCount(res.data.metadata.total_pages);
      })
      .finally(() => setOrdersLoading(false))
      .catch((err) => {
        console.log('An error occurred when trying to GET orders.', err);
        setOrdersError(err);
      });
  };

  useEffect(() => {
    if (entity && !ordersLoading && !depsLoading && shouldFetch) {
      fetchData({ pageIndex });
    }
  }, [entity, depsLoading]);

  return { orders, ordersLoading, ordersError, pageCount, fetchData };
}

export default useOrders;
