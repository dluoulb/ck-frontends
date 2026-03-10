import React from 'react';
import { faCheck, faXmark } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const comparisonFeatures = [
  {
    feature: '3% cash back when selecting Credit Key at checkout',
    standard: false,
    plus: true,
  },
  {
    feature: '1% cash back on Credit Key Card purchases',
    standard: false,
    plus: true,
  },
  {
    feature: 'Automatic reporting of repayments to leading business credit bureaus',
    standard: false,
    plus: true,
  },
  {
    feature: 'Choose Pay in 4 on any purchase, including Credit Key Card',
    standard: false,
    plus: true,
  },
  {
    feature: 'Priority support & dedicated phone line',
    standard: false,
    plus: true,
  },
];

const CheckIcon = ({ hasFeature }: { hasFeature: boolean }) => (
  <FontAwesomeIcon
    icon={hasFeature ? faCheck : faXmark}
    className={`size-5 mx-auto ${hasFeature ? 'text-success' : 'text-gray-300'}`}
  />
);

export default function ComparisonTable() {
  return (
    <div className="my-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left font-bold text-lg">See the Difference</th>
            <th className="text-center py-2 px-4 font-normal">Standard Members</th>
            <th className="text-center py-2 px-4 font-bold bg-[#EEFDF3] border-l border-r border-t border-gray-200">
              Plus Members
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonFeatures.map((feature, index) => (
            <tr key={index}>
              <td className="py-2 text-gray-700">{feature.feature}</td>
              <td className="py-2 text-center">
                <CheckIcon hasFeature={feature.standard} />
              </td>
              <td
                className={`py-2 text-center bg-[#EEFDF3] border-l border-r border-gray-200 ${index === comparisonFeatures.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <CheckIcon hasFeature={feature.plus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
