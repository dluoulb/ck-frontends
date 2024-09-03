import React, { useCallback, useState } from 'react';

export default function useModal(initialModalState = undefined) {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalState, setModalState] = useState(initialModalState);

  const toggleModal = useCallback(
    () => setIsModalActive((isModalActive) => !isModalActive),
    []
  );

  const resetModalState = () => setModalState(initialModalState);

  return {
    modalState,
    setModalState,
    resetModalState,
    isModalActive,
    setIsModalActive,
    toggleModal,
  };
}
