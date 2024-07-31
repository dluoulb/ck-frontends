import React from "react";
import Link from "next/link";

import { address, highlightMatches } from "../helpers";
import { fromISO } from "../../../../../lib/utils/datetime_formatters";

export default function OrderHit({ hit }) {
  const clipOrderKey = (key) => {
    if (key.length > 13) return `${key.substring(0, 13)}...`;

    return key;
  };

  return (
    <article className="py-3 border-b w-full" key={hit.id} id="search_result">
      <div className="flex flex-col md:flex-row md:gap-3 w-full">
        <span className="w-1/3 md:w-1/10 lg:w-1/12 flex items-center justify-center rounded-md px-3 lg:px-0 py-1 capitalize font-semibold bg-secondary-blue text-primary-blue text-xs tracking-wide">
          Order
        </span>
        <Link
          className="text-lg font-bold text-primary-blue cursor-pointer underline"
          href={`/reports/orders/${hit.order_key}`}
        >
          {clipOrderKey(hit.order_key)}
        </Link>
      </div>
      <div className="capitalize grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 text-sm px-1">
        <div className="col-span-2">
          <p>ID: {hit.id}</p>
          <p>Created: {fromISO(hit.created_at).toLocaleString()}</p>
          <p className="normal-case">Match: {highlightMatches(hit)}</p>
        </div>
        <p className="col-span-2">
          <span className="block">
            Owner: {hit.first_name} {hit.last_name}
          </span>
          <span className="block">
            Shipping Address: {address(hit.shipping_address)}
          </span>
        </p>
        <div className="col-span-1">
          <div>
            <p>Status: {hit.status}</p>
            <p>Type: {hit.product_type.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
