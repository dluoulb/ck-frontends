import {
  faChartPieSimple,
  faCircleExclamationCheck,
  faClock,
  faDollarSign,
} from '@fortawesome/pro-regular-svg-icons';
import { faArrowRotateLeft, faExclamation, faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const getIcon = (status) => {
  let scheduleIcon;
  let iconClass;

  switch (status) {
    case 'returned':
    case 'canceled':
    case 'error':
    case 'declined':
    case 'late':
      scheduleIcon = <FontAwesomeIcon icon={faExclamation} />;
      iconClass = 'bg-error';
      break;

    case 'created':
    case 'pending':
    case 'authorized':
    case 'scheduled':
      scheduleIcon = <FontAwesomeIcon icon={faClock} />;
      iconClass = 'bg-warning';
      break;

    case 'paid':
      scheduleIcon = <FontAwesomeIcon icon={faDollarSign} />;
      iconClass = 'bg-primary-blue';
      break;

    case 'refunded':
      scheduleIcon = <FontAwesomeIcon icon={faArrowRotateLeft} />;
      iconClass = 'bg-secondary-gray';
      break;

    case 'pending/late':
      scheduleIcon = <FontAwesomeIcon icon={faClock} />;
      iconClass = 'bg-error';
      break;

    case 'partial/pending':
      scheduleIcon = <FontAwesomeIcon icon={faChartPieSimple} />;
      iconClass = 'bg-warning';
      break;

    case 'partial':
    case 'partial/late':
      scheduleIcon = <FontAwesomeIcon icon={faChartPieSimple} />;
      iconClass = status.includes('late') ? 'bg-error' : 'bg-primary-blue';
      break;

    case 'partial/pending/late':
      scheduleIcon = <FontAwesomeIcon icon={faCircleExclamationCheck} />;
      iconClass = 'bg-error';
      break;

    default:
      scheduleIcon = <FontAwesomeIcon icon={faQuestion} />;
      iconClass = 'bg-secondary-gray';
      break;
  }

  return { iconClass, scheduleIcon };
};
