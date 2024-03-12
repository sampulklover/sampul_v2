import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import { processForm } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useUser } from '../context/user';

const DangerZone = () => {
  const { user } = useUser();
  const router = useRouter();
  const [summary, setSummary] = useState({
    isSaving: false,
  });

  const deleteAccount = async () => {
    if (
      confirm(
        `Are you sure you want to delete your account? if you continue, this cannot be undone. Would you like to continue?`
      )
    ) {
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
          body: JSON.stringify({ uuid: user?.uuid }),
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
    }
  };

  return (
    <>
      <div class="mt-4">
        <div class="row mb-4">
          <div class="col-lg">
            <div class="smpl_text-sm-semibold">Delete Account</div>
            <div class="smpl_text-sm-regular">
              Deleting your account will remove all of your information from our
              database. This cannot be undone.
            </div>
          </div>
          <div class="col text-end mt-md-0 mt-3"></div>
        </div>
        <button
          type="button"
          class="btn btn-danger btn-lg btn-text"
          onClick={() => {
            deleteAccount();
          }}
        >
          <Loading title="Delete Account" loading={summary.isSaving} />
        </button>
      </div>
    </>
  );
};

export default DangerZone;
