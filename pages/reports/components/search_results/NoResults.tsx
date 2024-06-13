import { FC, useState, useEffect } from "react";
import { useInstantSearch } from "react-instantsearch";
import classnames from "classnames";

export const NoResultsBoundary = ({ children, fallback, type }) => {
  const { results } = useInstantSearch();
  const [noValidResults, setNoValidResults] = useState(false);

  useEffect(() => {
    if (
      type === "credit_key_applications" &&
      results?.hits?.every((r) => !r.company_id) &&
      !results.__isArtificial
    )
      setNoValidResults(true);
  }, [results]);

  if (!results.__isArtificial && (results.nbHits === 0 || noValidResults)) {
    // The `__isArtificial` flag makes sure not to display the No Results message
    // when no hits have been returned yet.
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
};

interface NoResultsProps {
  query?: string;
  type?: string;
  hideFallbackMsg?: boolean;
}

export const NoResults: FC<NoResultsProps> = ({
  query,
  type,
  hideFallbackMsg,
}) => {
  return (
    <p className={classnames({ hidden: !hideFallbackMsg })}>
      No matching {type} results for <q>{query}</q>.
    </p>
  );
};
