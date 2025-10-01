import React from 'react';

type CTAProps = {
  onJoinClick: () => void;
};

export default function CTA({ onJoinClick }: CTAProps) {
  return (
    <div className="bg-[#F4F8FF] p-6 my-6 gap-2 flex flex-col border border-primary-gray-border rounded-lg">
      <h3 className="text-2xl font-bold">Ready to earn?</h3>
      <p>The smarter way to manage business spending with unlimited rewards.</p>
      <button
        onClick={onJoinClick}
        className="bg-primary-blue text-white px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors self-start"
      >
        Join Credit Key Plus
      </button>
    </div>
  );
}
