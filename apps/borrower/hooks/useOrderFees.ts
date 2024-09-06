import { useEffect, useState } from 'react';

import {
  calculateFeeTotals,
  getCompressedFeeSummary,
  getFeeBreakdownDisplay,
  getFeeTitle,
} from '../utils/fee_display_helpers';

function useOrderFees(order) {
  const [feeSummary, setFeeSummary] = useState([]);
  const [feeDisplay, setFeeDisplay] = useState({});
  const [compressedFeeSummary, setCompressedFeeSummary] = useState([]);

  useEffect(() => {
    if (order) {
      setFeeSummary(calculateFeeTotals(order));
    }
  }, [order]);

  useEffect(() => {
    if (feeSummary?.length) {
      const { result, feeDisplaySettings } =
        getCompressedFeeSummary(feeSummary);

      setCompressedFeeSummary(result);
      setFeeDisplay(feeDisplaySettings);
    }
  }, [feeSummary]);

  return {
    compressedFeeSummary,
    feeDisplay,
    setFeeDisplay,
    getFeeTitle,
    getFeeBreakdownDisplay,
  };
}

export default useOrderFees;
