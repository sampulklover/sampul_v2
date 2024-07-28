import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { processForm } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Password = () => {
  const { locale } = useLocale();
  const [summary, setSummary] = useState({
    isSaving: false,
  });

  const elementList = () => {
    const inputElements = {
      password: {
        elements: {
          password: document.getElementById('input-password-new-password'),
          confirm_new_password: document.getElementById(
            'input-password-confirm-new-password'
          ),
        },
      },
    };

    return inputElements;
  };

  const onSubmitForm = async () => {
    function arePasswordsEqual() {
      const elements = elementList().password.elements;
      const newPassword = elements.password.value;
      const confirmNewPassword = elements.confirm_new_password.value;
      return newPassword === confirmNewPassword;
    }

    if (arePasswordsEqual()) {
      setSummary({
        ...summary,
        isSaving: true,
      });

      const addData = processForm(elementList().password.elements, false);
      const { data, error } = await supabase.auth.updateUser(addData);

      if (error) {
        toast.error(error.message);
        setSummary({
          ...summary,
          isSaving: false,
        });
        return;
      }

      toast.success(translations[locale].global.updated_successfully);

      setSummary({
        ...summary,
        isSaving: false,
      });
    } else {
      toast.error(translations[locale].global.password_do_not_);
    }
  };

  return (
    <>
      <form
        class="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        <div class="row mb-4">
          <div class="col-lg">
            <div class="smpl_text-sm-semibold">
              {translations[locale].component.password.password}
            </div>
            <div class="smpl_text-sm-regular">
              {translations[locale].component.password.please_enter_your_}
            </div>
          </div>
          <div class="col text-end mt-md-0 mt-3">
            <button type="submit" class="btn btn-primary btn-text">
              <Loading
                title={translations[locale].component.password.update_password}
                loading={summary.isSaving}
              />
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="input-password-new-password"
              class="uui-field-label"
            >
              {translations[locale].component.password.new_password}
            </label>
          </div>
          <div class="col">
            <input
              type="password"
              class="form-control"
              id="input-password-new-password"
              required
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="input-password-confirm-new-password"
              class="uui-field-label"
            >
              {translations[locale].component.password.confirm_new_password}
            </label>
          </div>
          <div class="col">
            <input
              type="password"
              class="form-control"
              id="input-password-confirm-new-password"
              required
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Password;

// The summary of this page includes:
// This page is designed to allow users to update their password securely.
// It includes form elements for entering a new password and confirming it.
// When the user submits the form, the component verifies if the passwords match.
// If they do, it initiates a process to update the password using Supabase authentication services.
// During this process, a loading indicator is displayed.
// If there's an error, such as passwords not matching or a server issue,
// appropriate messages are shown using toast notifications.
