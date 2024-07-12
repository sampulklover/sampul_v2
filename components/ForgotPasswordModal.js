import Loading from '../components/Laoding';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { supabase } from '../utils/supabase';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ForgotPasswordModal = () => {
  const { locale } = useLocale();

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
      translations[locale].component.forgot_password_modal
        .password_recovery_email_,
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
            <h5 class="modal-title">
              {
                translations[locale].component.forgot_password_modal
                  .forgot_password
              }
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              {
                translations[locale].component.forgot_password_modal
                  .please_enter_your_
              }
            </p>
            <form>
              <div class="mb-3">
                <label
                  htmlFor="input-forgot-password-email"
                  class="uui-field-label"
                >
                  {translations[locale].component.forgot_password_modal.email}
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
                  class="btn btn-primary btn-text"
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

// The summary of this page includes:
// This page contains modal appears centered on the screen and prompts users to enter their email address.
// Upon submission, it sends a password reset email using Supabase authentication services.
