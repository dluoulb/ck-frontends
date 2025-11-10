import React, { useEffect, useState } from 'react';

export default function SelectionWidget({ count, activeIndex, onSelect }) {
  const [items, setItems] = useState(new Array(count).fill(true));

  const renderItems = () => {
    return items.map((_item, idx) => {
      if (idx === activeIndex) {
        return (
          <div key={idx} className="m-1 inline-block rounded-full w-[30px] h-[10px] bg-[#0066FF]"></div>
        );
      }

      return (
        <div 
          onClick={() => onSelect(idx)}
          key={idx} 
          className="m-1 inline-block rounded-full w-[10px] h-[10px] bg-[#CDD5DE]"
        ></div>
      );
    });
  };

  useEffect(() => {
    setItems(new Array(count).fill(true));
  }, [count]);

  return (
    <div className="md:hidden" role={SelectionWidget.role}>
      {renderItems()}     
    </div>
  );
}

SelectionWidget.role = 'selection-widget';

