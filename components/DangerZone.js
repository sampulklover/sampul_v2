import { useState } from 'react';
import { useRouter } from 'next/router';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import { useApi } from '../context/api';

const DangerZone = () => {
  const { contextApiData } = useApi();

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

        toast.success('Deleted successfully!');

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
      toast.error('Input do not match!');
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
            <div class="smpl_text-sm-semibold">Delete Account</div>
            <div class="smpl_text-sm-regular">
              Deleting your account will remove all of your information from our
              database. This cannot be undone.
            </div>
          </div>
          <div class="col text-end mt-md-0 mt-3">
            <button type="submit" class="btn btn-danger btn-text">
              <Loading title="Delete Account" loading={summary.isSaving} />
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="input-password-new-password"
              class="uui-field-label"
            >
              To delete your Sampul account please type "delete my account"
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
