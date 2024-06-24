import Loading from '../components/Laoding';
import { supabase } from '../utils/supabase';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState({
    new_password: false,
  });

  const onSubmitUpdatePassword = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      new_password: true,
    });

    const { data, error } = await supabase.auth.updateUser({
      password: document.getElementById('input-new-password').value,
    });

    setIsLoading({
      ...isLoading,
      new_password: false,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Password changed!');
  };

  return (
    <div class="body">
      <div class="row">
        <div class="col-lg-4">
          <h2 class="uui-heading-medium-10">
            <strong class="smpl-heading-large fw-semibold">
              Change Password
            </strong>
          </h2>
          <div class="uui-space-xsmall-3"></div>
          <div class="smpl-text-size-large">Please enter your new password</div>
          <div class="mt-5">
            <form class="mb-3" onSubmit={onSubmitUpdatePassword}>
              <div class="mb-4">
                <label htmlFor="input-password" class="uui-field-label">
                  New Password
                </label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="input-new-password"
                  required
                />
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading title="Update" loading={isLoading.new_password} />
                </button>
              </div>
            </form>
            <div class="d-grid gap-2">
              <Link href="signin" class="btn btn-light btn-text">
                <span class="ms-3">
                  <i class="bi bi-arrow-left"></i> Back to Sign in
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div class="col-lg">
          <img
            src="/images/Digital-coins.svg"
            loading="lazy"
            alt="Contact image"
            class="uui-contact05_image"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

// Summary for this page includes:
// This page is for changing your password. It includes a form where you can enter a new password.
// When you submit the form, it sends a request to update your password using the Supabase
// authentication service. While it processes, a loading indicator shows to let you know it's working.
// If there's an error, like if the new password isn't accepted, it shows an error message.
// Once the password is successfully changed, it displays a success message.
