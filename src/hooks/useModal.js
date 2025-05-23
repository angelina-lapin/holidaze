import { useState } from 'react';

export function useModal(defaults = {}) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    ...defaults,
  });

  const openModal = (props = {}) =>
    setModal((prev) => ({ ...prev, isOpen: true, ...props }));

  const closeModal = () =>
    setModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));

  return { modal, openModal, closeModal };
}
