import { useEffect, useState } from 'react';

function useDropdown(defaultContentId = '') {
  const [contentId, setContentId] = useState(defaultContentId);
  const setContent = (id) => setContentId(id);
  
  useEffect(() => {
    setContentId(defaultContentId);
  },[defaultContentId])

  return {
    contentId,
    setContentId,
    setContent,
  };
}

export default useDropdown;
