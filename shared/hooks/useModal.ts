import { useCallback, useRef, useState } from 'react';

export default function useModal(initialModalState = undefined) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalState, setModalState] = useState(initialModalState);
  const initialModalStateRef = useRef(initialModalState);

  const toggleModal = useCallback(() => setIsModalActive((isModalActive) => !isModalActive), []);

  const resetModalState = useCallback(() => setModalState(initialModalStateRef.current), []);

  return {
    modalState,
    setModalState,
    resetModalState,
    isModalActive,
    setIsModalActive,
    toggleModal,
  };
}
