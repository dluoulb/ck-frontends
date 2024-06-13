import { Highlight } from "react-instantsearch";
import { formatZip } from "../../../../lib/utils/formatters";

export const highlightMatches = (result) => {
  const keys = Object.keys(result?._highlightResult);

  const highlightedMatches = keys
    .filter((k) => result?._highlightResult[k].matchLevel === "full")
    .map((k, index, arr) => (
      <span key={k}>
        <Highlight attribute={k} hit={result} />{" "}
        <span className="text-tertiary-gray">({k.replace(/_/g, " ")})</span>
        {index < arr.length - 1 && ", "}
      </span>
    ));

  return <>{highlightedMatches}</>;
};

export const address = (address) => {
  if (!address) return "Not Provided";
  return (
    <span>
      {address?.address1} {address?.address2} {address?.city}, {address?.state}{" "}
      {formatZip(address?.zip)}
    </span>
  );
};
