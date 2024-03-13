import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';

const ForgotPasswordModal = () => {
  const [isLoading, setIsLoading] = useState({
    send_recovery: false,
  });

  const onClickForgotPassword = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      send_recovery: true,
    });

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      document.getElementById('input-forgot-password-email').value,
      {
        redirectTo: process.env.NEXT_PUBLIC_CHANGE_PASSWORD_REDIRECT_URL,
      }
    );

    setIsLoading({
      ...isLoading,
      send_recovery: false,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      'Password recovery email has been sent, please check your inbox.',
      {
        duration: 6000,
      }
    );
  };

  return (
    <div class="modal fade" id="forgot-password-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Forgot Password</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Please enter your email address. We'll send you a link to change
              your password.
            </p>
            <form>
              <div class="mb-3">
                <label
                  htmlFor="input-forgot-password-email"
                  class="uui-field-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="input-forgot-password-email"
                  required
                />
              </div>
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg btn-text"
                  onClick={onClickForgotPassword}
                >
                  <Loading title="Send" loading={isLoading.send_recovery} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
