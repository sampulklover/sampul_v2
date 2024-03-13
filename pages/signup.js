import { useState } from 'react';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import Link from 'next/link';

const SignUp = () => {
  const { normalSignup, googleLogin } = useUser();
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

    await normalSignup({
      name: document.getElementById('input-name').value,
      email: document.getElementById('input-email').value,
      password: document.getElementById('input-password').value,
    });

    setIsLoading({
      ...isLoading,
      normal_signup: false,
    });
  };

  const onClickGoogleLogin = async (event) => {
    event.preventDefault();
    setIsLoading({
      ...isLoading,
      google_login: true,
    });

    await googleLogin();

    setIsLoading({
      ...isLoading,
      google_login: false,
    });
  };

  return (
    <div class="body px-5">
      <div class="row">
        <div class="col-lg-4">
          <h2 class="uui-heading-medium-10">
            <strong class="smpl-heading-large fw-semibold">Sign up</strong>
          </h2>
          <div class="uui-space-xsmall-3"></div>
          <div class="smpl-text-size-large">
            Your journey towards a secure, seamless, and meaningful digital
            estate starts here.
          </div>
          <div class="mt-5">
            <form class="mb-3" onSubmit={onSubmitNormalSignup}>
              <div class="mb-3">
                <label htmlFor="input-username" class="uui-field-label">
                  Name
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
                  Email
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
                  Password
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
                    You agree to our friendly{' '}
                    <Link href="policy" target="_blank">
                      privacy policy.
                    </Link>
                  </label>
                </div>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Sign up" loading={isLoading.normal_signup} />
                </button>
              </div>
            </form>
            <div class="d-grid gap-2">
              <button
                type="button"
                class="btn btn-light btn-lg btn-text"
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
              Already have an account?{' '}
              <Link href="signin" style={{ textDecoration: 'none' }}>
                <strong class="text-primary">Sign in</strong>
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
