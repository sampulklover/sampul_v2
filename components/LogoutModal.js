import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useUser } from '../context/user';

const LogoutModal = () => {
  const router = useRouter();
  const { logout } = useUser();
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
                class="btn btn-primary btn-lg btn-text"
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
