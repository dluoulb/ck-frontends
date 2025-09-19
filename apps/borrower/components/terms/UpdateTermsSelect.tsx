import { useEffect } from 'react';
import PrimaryButton from '@components/buttons/PrimaryButton';

type ApprovedTerm = {
  available: boolean;
  term: number;
  term_period: string;
};

export default function UpdateTermsSelect({
  terms,
  oldTerm,
  selectedTerm,
  setSelectedTerm,
  onNext,
}: {
  terms: ApprovedTerm[];
  oldTerm: number;
  selectedTerm: number | null;
  setSelectedTerm: (term: number) => void;
  onNext: () => void;
}) {
  const options = (terms ?? [])
    .filter((t) => t?.available)
    .map((t) => ({
      label: `${t.term} ${t.term === 1 ? 'month' : 'months'}`,
      value: String(t.term),
    }));

  return (
    <div>
      <label htmlFor="term-select" className="block mb-2 font-semibold">
        Choose a new payment term:
      </label>
      <select
        id="term-select"
        className="w-full p-2 border rounded mb-4"
        value={selectedTerm ?? oldTerm ?? ''}
        onChange={(e) => setSelectedTerm(Number(e.target.value))}
      >
        <option value="" disabled>
          Select term
        </option>
        {terms.map((term) => (
          <option key={term.term} value={term.term}>
            {term.term} {term.term === 1 ? 'month' : 'months'}
          </option>
        ))}
      </select>
      <div className="flex justify-end">
        <PrimaryButton
          ariaLabel="submit-loan-terms"
          buttonText="Next"
          buttonColor="bg-primary-blue text-white"
          hoverClass="hover:bg-primary-blue-hover"
          disabled={!selectedTerm || selectedTerm === oldTerm}
          onClick={onNext}
          containerClass="min-w-[250px] whitespace-nowrap"
        />
      </div>
    </div>
  );
}
