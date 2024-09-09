import Loading from '../components/Laoding';
import { useApi } from '../context/api';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useState } from 'react';

const SignUp = () => {
  const { normalSignup, googleLogin } = useApi();
  const [isLoading, setIsLoading] = useState({
    normal_signup: false,
    google_login: false,
  });

  const onSubmitNormalSignup = async (event) => {
    event.preventDefault();

    setIsLoading({
      ...isLoading,
      normal_signup: true,
    });

    const signUpBtn = document.getElementById('btn-normal-sign-up');
    signUpBtn.disabled = true;

    try {
      await normalSignup({
        name: document.getElementById('input-name').value,
        email: document.getElementById('input-email').value,
        password: document.getElementById('input-password').value,
      });
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setTimeout(() => {
        signUpBtn.disabled = false;
        setIsLoading({
          ...isLoading,
          normal_signup: false,
        });
      }, 5000);
    }
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
      <div class="row">
        <div class="col-lg-4 px-5 py-5">
          <h2 class="uui-heading-medium-10">
            <strong class="smpl-heading-large fw-semibold">Daftar</strong>
          </h2>
          <div class="uui-space-xsmall-3"></div>
          <div class="smpl-text-size-large">
          Perjalanan anda ke arah harta digital yang selamat, lancar, bermakna bermula di sini.
          </div>
          <div class="mt-5">
            <form class="mb-3" onSubmit={onSubmitNormalSignup}>
              <div class="mb-3">
                <label htmlFor="input-username" class="uui-field-label">
                  Nama
                </label>
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="input-name"
                  required
                />
              </div>
              <div class="mb-3">
                <label htmlFor="input-email" class="uui-field-label">
                  Emel
                </label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="input-email"
                  required
                />
              </div>
              <div class="mb-3">
                <label htmlFor="input-password" class="uui-field-label">
                  Kata Laluan
                </label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="input-password"
                  required
                />
              </div>
              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="input-check-tnc"
                    required
                  />
                  <label class="form-check-label" htmlFor="flexCheckChecked">
                    Anda bersetuju dengan {' '}
                    <Link href="policy" target="_blank">
                      polisi privasi
                    </Link> kami yang mesra.
                  </label>
                </div>
              </div>
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary btn-text"
                  id="btn-normal-sign-up"
                >
                  <Loading title="Daftar" loading={isLoading.normal_signup} />
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
                    title="Teruskan dengan Google"
                    loading={isLoading.google_login}
                  />
                </span>
              </button>
            </div>
            <p class="text-center mt-4">
            Sudah mempunyai akaun?{' '}
              <Link href="signin_BM" style={{ textDecoration: 'none' }}>
                <strong class="text-primary">Log masuk</strong>
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

export default SignUp;

// The summary of this page includes:
// This page is about a signup form. It offers two ways to register: normal signup and Google login.
// The form requires users to input their name, email, and password, agreeing to a privacy policy.
// There's also an option to sign up using a Google account.
// When users submit the form, it disables the signup button temporarily to prevent multiple submissions.
// Error handling is implemented using Sentry for tracking and logging errors.
