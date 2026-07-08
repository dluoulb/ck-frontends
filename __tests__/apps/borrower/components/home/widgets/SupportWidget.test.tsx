import SupportWidget from '@apps/borrower/components/home/widgets/SupportWidget';
import { renders } from '@lib/testing/sharedTests';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Support Widget Component', () => {
  renders(SupportWidget);

  test('shows support title by default', () => {
    customRender(<SupportWidget />);

    expect(screen.getByText('Need Support?')).toBeInTheDocument();
  });

  test('shows suspended card call support prompt when enabled', () => {
    customRender(<SupportWidget showSuspendedCardPrompt />);

    expect(screen.queryByText('Need Support?')).not.toBeInTheDocument();
    expect(screen.getByText(/Your card is suspended\. Please call/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /\+1 \(844\) 334-3636/i })).toBeInTheDocument();
    expect(screen.queryByText('View our help center for common questions')).not.toBeInTheDocument();
  });
});
