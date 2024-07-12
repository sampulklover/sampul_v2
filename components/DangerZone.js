import { bucketName } from '../constant/element';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { deleteMyStorage } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DangerZone = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();

  const router = useRouter();
  const [summary, setSummary] = useState({
    isSaving: false,
  });

  const elementList = () => {
    const inputElements = {
      delete_account: {
        elements: {
          confirmation_text: document.getElementById(
            'input-danger-zone-confirmation-text'
          ),
        },
      },
    };

    return inputElements;
  };

  const CONFIRMATION_TEXT = 'delete my account';

  const onSubmitForm = async () => {
    function areConfirmationTextEqual() {
      const elements = elementList().delete_account.elements;
      const confirmationInput = elements.confirmation_text.value;
      const confirmationText = CONFIRMATION_TEXT;
      return confirmationInput === confirmationText;
    }
    if (areConfirmationTextEqual()) {
      setSummary({
        ...summary,
        isSaving: true,
      });

      try {
        const response = await fetch('/api/profile/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: contextApiData.user.data?.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error.message, { duration: 6000 });
          setSummary({
            ...summary,
            isSaving: false,
          });
          return;
        }

        deleteMyStorage({
          userId: contextApiData.user.data?.id,
        });

        toast.success(
          translations[locale].component.danger_zone.deleted_successfully
        );

        setSummary({
          ...summary,
          isSaving: false,
        });

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        toast.error(error.message);
        setSummary({
          ...summary,
          isSaving: false,
        });
      }
    } else {
      toast.error(translations[locale].component.danger_zone.input_do_not_);
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
              {translations[locale].component.danger_zone.delete_account}
            </div>
            <div class="smpl_text-sm-regular">
              {
                translations[locale].component.danger_zone
                  .deleting_your_account_
              }
            </div>
          </div>
          <div class="col text-end mt-md-0 mt-3">
            <button type="submit" class="btn btn-danger btn-text">
              <Loading
                title={
                  translations[locale].component.danger_zone.delete_account
                }
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
              {translations[locale].component.danger_zone.to_delete_your_}{' '}
              "delete my account"
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-danger-zone-confirmation-text"
              required
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default DangerZone;

// The summary of this page includes:
// This page is designed for managing account deletion functionality.
// Key features include form submission handling, validation to confirm user intent,
// and integration with a backend API for account deletion.
// Users must input specific text to initiate account deletion,
// and upon confirmation, their data is removed from the system permanently.
