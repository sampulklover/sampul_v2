import ForgotPasswordModal from '../components/ForgotPasswordModal';
import Loading from '../components/Laoding';
import { useApi } from '../context/api';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignIn = () => {
  const { normalLogin, googleLogin } = useApi();
  const [isLoading, setIsLoading] = useState({
    normal_login: false,
    google_login: false,
  });

  const router = useRouter();

  const onSubmitNormalLogin = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      normal_login: true,
    });

    try {
      await normalLogin({
        email: document.getElementById('input-email').value,
        password: document.getElementById('input-password').value,
      });
    } catch (error) {
      Sentry.captureException(error);
    }

    setIsLoading({
      ...isLoading,
      normal_login: false,
    });
  };

  const onClickGoogleLogin = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      google_login: true,
    });

    try {
      await googleLogin();
    } catch (error) {
      Sentry.captureException(error);
    }

    setIsLoading({
      ...isLoading,
      google_login: false,
    });
  };

  return (
    <div class="body-01">
      <ForgotPasswordModal />
      <div class="row">
        <div class="col-lg-4 px-5 py-5">
          <h2 class="uui-heading-medium-10">
            <strong class="smpl-heading-large fw-semibold">Sign in </strong>
          </h2>
          <div class="uui-space-xsmall-3"></div>
          <div class="smpl-text-size-large">
            Welcome back, enter your details
          </div>
          <div class="mt-5">
            <form class="mb-3" onSubmit={onSubmitNormalLogin}>
              <div class="mb-3">
                <label htmlFor="input-email" class="uui-field-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="input-email"
                  required
                />
              </div>
              <div class="mb-1">
                <label htmlFor="input-password" class="uui-field-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="input-password"
                  required
                />
              </div>
              <div class="mb-4 pointer-on-hover text-end">
                <small
                  id="btn-forgot-password"
                  data-bs-toggle="modal"
                  data-bs-target="#forgot-password-modal"
                >
                  Forgot Password?
                </small>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading title="Sign in" loading={isLoading.normal_login} />
                </button>
              </div>
            </form>
            <div class="d-grid gap-2">
              <button
                type="button"
                class="btn btn-light btn-text"
                onClick={onClickGoogleLogin}
              >
                <img
                  width="20px"
                  alt="Google sign-in"
                  src="images/google_icon_rounded.png"
                />
                <span class="ms-3">
                  <Loading
                    title="Continue with Google"
                    loading={isLoading.google_login}
                  />
                </span>
              </button>
            </div>
            <p class="text-center mt-4">
              Don't have an account?{' '}
              <Link href="signup" style={{ textDecoration: 'none' }}>
                <strong class="text-primary">Register</strong>
              </Link>
            </p>
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

export default SignIn;

// The summary of this page includes:
// The page features a sign-in form.
// It allows users to log in using their email and password or through Google.
// Errors during login attempts are captured and reported using @sentry/nextjs for better debugging and monitoring.
