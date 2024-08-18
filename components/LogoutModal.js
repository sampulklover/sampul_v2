import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import Loading from './Laoding';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const LogoutModal = () => {
  const { logout } = useApi();
  const { locale } = useLocale();
  const { isModalOpen, toggleModal } = useModal();
  const [isLoading, setIsLoading] = useState({
    is_logout: false,
  });

  const onClickLogout = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      is_logout: true,
    });

    await logout();

    toggleModal('logout');

    setIsLoading({
      ...isLoading,
      is_logout: false,
    });
  };

  return (
    <Modal
      show={isModalOpen.logout}
      onHide={() => {
        toggleModal('logout');
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">
            {translations[locale].component.logout_modal.sign_out}
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{translations[locale].component.logout_modal.are_you_confirm_}</p>
        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary btn-text"
            onClick={onClickLogout}
          >
            <Loading
              title={translations[locale].component.logout_modal.sign_out}
              loading={isLoading.is_logout}
            />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;

// The summary of this page includes:
// This page is designed to handle user logout functionality.
// It integrates with a custom API hook for handling logout operations.
// The modal interface prompts users with a confirmation message before logging out,
// ensuring they want to end their current session.
// Upon clicking the logout button, the component triggers an asynchronous logout process, updating the loading state to indicate activity.
// Once logout completes, it hides the modal and resets the loading state.
