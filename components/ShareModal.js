import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ShareModal = ({ url, title }) => {
  const { locale } = useLocale();

  const checkUrl = () => {
    var proceed = false;

    if (url) {
      proceed = true;
    } else {
      toast.error(
        translations[locale].component.share_modal.please_generate_your_
      );
      proceed = false;
    }

    return proceed;
  };

  const facebookShare = () => {
    const proceed = checkUrl(url);
    if (proceed)
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(url) +
          '&title=' +
          encodeURIComponent(title),
        '_blank'
      );
  };

  const twitterShare = () => {
    const proceed = checkUrl(url);
    if (proceed)
      window.open(
        'https://twitter.com/intent/tweet?url=' +
          encodeURIComponent(url) +
          '&text=' +
          encodeURIComponent(title),
        '_blank'
      );
  };

  const linkedInShare = () => {
    const proceed = checkUrl(url);
    if (proceed)
      window.open(
        'https://www.linkedin.com/shareArticle?url=' +
          encodeURIComponent(url) +
          '&title=' +
          encodeURIComponent(title),
        '_blank'
      );
  };

  const copyLink = async () => {
    const proceed = checkUrl(url);
    if (proceed)
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied!');
      } catch (error) {
        toast.error(error);
      }
  };

  return (
    <div class="modal fade" id="share-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom-0">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <img width="300px" src="images/will_dashboard.png" />

            <h5 class="mt-3">
              {translations[locale].component.share_modal.share_certificate_on_}
            </h5>
            <div class="smpl_text-sm-medium mb-5">
              {translations[locale].component.share_modal.let_your_will_}
            </div>

            <div class="row">
              <div class="col-sm-auto">
                <button
                  type="button"
                  class="btn btn-light btn-text me-1"
                  onClick={() => {
                    facebookShare();
                  }}
                >
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Social icon" clipPath="url(#clip0_252_2214)">
                        <path
                          id="Vector"
                          d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                          fill="#1877F2"
                        />
                        <path
                          id="Vector_2"
                          d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_252_2214">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </button>
                <button
                  class="btn btn-light btn-text me-1"
                  id="share-twitter-btn"
                  onClick={() => {
                    twitterShare();
                  }}
                >
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Social icon">
                        <path
                          id="Vector"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.9455 23L10.396 15.0901L3.44886 23H0.509766L9.09209 13.2311L0.509766 1H8.05571L13.286 8.45502L19.8393 1H22.7784L14.5943 10.3165L23.4914 23H15.9455ZM19.2185 20.77H17.2398L4.71811 3.23H6.6971L11.7121 10.2532L12.5793 11.4719L19.2185 20.77Z"
                          fill="#242E36"
                        />
                      </g>
                    </svg>
                  </span>
                </button>
                <button
                  class="btn btn-light btn-text me-1"
                  onClick={() => {
                    linkedInShare();
                  }}
                >
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Social icon" clipPath="url(#clip0_252_335)">
                        <path
                          id="Vector"
                          d="M22.2283 0H1.77167C1.30179 0 0.851161 0.186657 0.518909 0.518909C0.186657 0.851161 0 1.30179 0 1.77167V22.2283C0 22.6982 0.186657 23.1488 0.518909 23.4811C0.851161 23.8133 1.30179 24 1.77167 24H22.2283C22.6982 24 23.1488 23.8133 23.4811 23.4811C23.8133 23.1488 24 22.6982 24 22.2283V1.77167C24 1.30179 23.8133 0.851161 23.4811 0.518909C23.1488 0.186657 22.6982 0 22.2283 0ZM7.15333 20.445H3.545V8.98333H7.15333V20.445ZM5.34667 7.395C4.93736 7.3927 4.53792 7.2692 4.19873 7.04009C3.85955 6.81098 3.59584 6.48653 3.44088 6.10769C3.28591 5.72885 3.24665 5.31259 3.32803 4.91145C3.40941 4.51032 3.6078 4.14228 3.89816 3.85378C4.18851 3.56529 4.55782 3.36927 4.95947 3.29046C5.36112 3.21165 5.77711 3.25359 6.15495 3.41099C6.53279 3.56838 6.85554 3.83417 7.08247 4.17481C7.30939 4.51546 7.43032 4.91569 7.43 5.325C7.43386 5.59903 7.38251 5.87104 7.27901 6.1248C7.17551 6.37857 7.02198 6.6089 6.82757 6.80207C6.63316 6.99523 6.40185 7.14728 6.14742 7.24915C5.893 7.35102 5.62067 7.40062 5.34667 7.395ZM20.4533 20.455H16.8467V14.1933C16.8467 12.3467 16.0617 11.7767 15.0483 11.7767C13.9783 11.7767 12.9283 12.5833 12.9283 14.24V20.455H9.32V8.99167H12.79V10.58H12.8367C13.185 9.875 14.405 8.67 16.2667 8.67C18.28 8.67 20.455 9.865 20.455 13.365L20.4533 20.455Z"
                          fill="#0A66C2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_252_335">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </button>
              </div>
              <div class="col mt-sm-0 mt-3">
                <div class="row">
                  <div class="col">
                    <button
                      class="btn btn-light btn-text w-100"
                      onClick={() => {
                        copyLink();
                      }}
                    >
                      <span>
                        <i class="bi bi-copy"></i>{' '}
                        {translations[locale].component.share_modal.copy_link}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

// The summary of this page includes:
// This page is designed to facilitate sharing of a digital "Will Certificate" on social media platforms.
// It includes functionalities like sharing on Facebook, Twitter, and LinkedIn, as well as copying the certificate's URL.
// The modal interface displays an image of the certificate and encourages users to share it with loved ones, promoting a legacy of care and protection.
// Various buttons trigger actions to open social media sharing dialogs or copy the URL to the clipboard, accompanied by visual icons for each platform.
