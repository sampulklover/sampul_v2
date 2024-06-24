import { useApi } from '../context/api';
import Loading from './Laoding';
import { useState } from 'react';

const LogoutModal = () => {
  const { logout } = useApi();
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

    $('#logout-modal')?.modal('hide');
    setIsLoading({
      ...isLoading,
      is_logout: false,
    });
  };

  return (
    <div class="modal fade" id="logout-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sign out</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Are you confirm to signing out? this action will terminate the
              current session.
            </p>

            <div class="d-grid gap-2">
              <button
                type="submit"
                class="btn btn-primary btn-text"
                onClick={onClickLogout}
              >
                <Loading title="Sign out" loading={isLoading.is_logout} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
