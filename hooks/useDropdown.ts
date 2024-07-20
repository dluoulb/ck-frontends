import { useEffect, useState } from 'react';

function useDropdown(defaultContentId = '') {
  const [contentItems, setContentItems] = useState(defaultContentId);
  const setContent = (id) => setContentItems(id);
  
  useEffect(() => {
    setContentItems(defaultContentId);
  },[defaultContentId])

  return {
    contentItems,
    setContentItems,
    setContent,
  };
}

export default useDropdown;
