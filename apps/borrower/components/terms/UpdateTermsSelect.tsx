import PrimaryButton from '@components/buttons/PrimaryButton';
import { formatCurrency, getTermLabel } from '@lib/utils/formatters';

type ApprovedTerm = {
  available: boolean;
  term: number;
  term_period: string;
  rate?: number;
  monthly_payment?: string;
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
  const availableTerms = (terms ?? []).filter((t) => t?.available);

  return (
    <div>
      <label htmlFor="term-select" className="block mb-2 font-semibold">
        Choose a new payment term:
      </label>
      <select
        id="term-select"
        className="w-full p-2 border border-gray-200 rounded mb-4"
        value={selectedTerm ?? oldTerm ?? ''}
        onChange={(e) => setSelectedTerm(Number(e.target.value))}
      >
        <option value="" disabled>
          Select term
        </option>
        {availableTerms.map((term) => {
          const label = getTermLabel(term);
          const paymentInfo =
            term.monthly_payment != null
              ? ` — ${formatCurrency(Number(term.monthly_payment))}/mo`
              : '';
          const rateInfo =
            term.term_period !== 'days' && term.rate != null && term.rate > 0
              ? ` (${term.rate.toFixed(2)}% monthly)`
              : '';
          return (
            <option key={`${term.term}-${term.term_period}`} value={term.term}>
              {label}
              {paymentInfo}
              {rateInfo}
            </option>
          );
        })}
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
