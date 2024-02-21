import { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { instructionsAfterDeath, servicePlatforms } from '../constant/enum';
import { mapViewElements } from '../utils/helpers';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import WillActionButtons from '../components/WillActionButtons';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const cardRef = useRef(null);
  const [summary, setSummary] = useState({
    data: null,
    isReady: false,
  });
  const [isReady, setIsReady] = useState(true);
  const [runEffect, setRunEffect] = useState(false);
  const [qrValue, setQrValue] = useState(null);

  useEffect(() => {
    if (!runEffect && user.uuid !== null) {
      setRunEffect(true);

      const getUserProfile = async () => {
        const { data: singleData, error } = await supabase
          .from('profiles')
          .select(`*, beloved ( * ), digital_assets ( * ), wills ( * )`)
          .eq('uuid', user.uuid)
          .single();
        if (error) {
          setSummary({
            data: null,
            isReady: true,
          });
          toast.error(error.message);
          return;
        }
        singleData.digital_account = [];
        singleData.subscription_account = [];
        singleData.digital_assets.forEach((item) => {
          if (item.account_type === 'non_subscription') {
            singleData.digital_account.push(item);
          }
          if (item.account_type === 'subscription') {
            singleData.subscription_account.push(item);
          }
        });
        singleData.count_digital = singleData.digital_account.length;
        singleData.count_subscription = singleData.subscription_account.length;
        singleData.count_value_digital = singleData.digital_account.reduce(
          (acc, val) => acc + val.declared_value_myr,
          0
        );
        singleData.count_value_subscription =
          singleData.subscription_account.reduce(
            (acc, val) => acc + val.declared_value_myr,
            0
          );

        const displayElements = {
          count_value_digital: document.getElementById(
            'count-value-digital-account'
          ),
          count_digital: document.getElementById('count-digital-account'),
          count_value_subscription: document.getElementById(
            'count-value-subscription-account'
          ),
          count_subscription: document.getElementById(
            'count-subscription-account'
          ),
          last_updated: document.getElementById('last-updated-will'),
        };

        mapViewElements(singleData, displayElements);
        setSummary({
          data: singleData,
          isReady: true,
        });
      };

      getUserProfile();
    }
  }, [user, runEffect]);

  const section2 = () => {
    return (
      <>
        <div class="smpl_section-content wf-section">
          <div class="metric-group">
            <div class="metric-item">
              <div class="section-header">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.8778 20.0899C16.1693 21.3312 14.1117 21.9998 11.9999 21.9998C9.88812 21.9998 7.83054 21.3312 6.12206 20.0899M16.3836 3.01182C18.2817 3.93756 19.838 5.44044 20.8294 7.30504C21.8208 9.16964 22.1965 11.3002 21.9026 13.3915M2.09733 13.3914C1.80343 11.3002 2.17911 9.16955 3.17053 7.30494C4.16196 5.44034 5.71823 3.93747 7.6163 3.01172M11.4342 6.56544L6.5656 11.4341C6.36759 11.6321 6.26859 11.7311 6.23149 11.8452C6.19886 11.9457 6.19886 12.0538 6.23149 12.1543C6.26859 12.2684 6.36759 12.3674 6.5656 12.5654L11.4342 17.4341C11.6322 17.6321 11.7312 17.7311 11.8454 17.7682C11.9458 17.8008 12.054 17.8008 12.1544 17.7682C12.2686 17.7311 12.3676 17.6321 12.5656 17.4341L17.4342 12.5654C17.6322 12.3674 17.7312 12.2684 17.7683 12.1543C17.801 12.0538 17.801 11.9457 17.7683 11.8452C17.7312 11.7311 17.6322 11.6321 17.4342 11.4341L12.5656 6.56544C12.3676 6.36743 12.2686 6.26843 12.1544 6.23134C12.054 6.19871 11.9458 6.19871 11.8454 6.23134C11.7312 6.26843 11.6322 6.36743 11.4342 6.56544Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="heading-and-number">
                <div class="smpl_text-sm-medium">Value of Digital Account</div>
                <div class="number-and-badge">
                  <div class="smpl_display-sm-semibold">
                    <sup>RM</sup>
                    <span id="count-value-digital-account">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="section-header">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.8778 20.0899C16.1693 21.3312 14.1117 21.9998 11.9999 21.9998C9.88812 21.9998 7.83054 21.3312 6.12206 20.0899M16.3836 3.01182C18.2817 3.93756 19.838 5.44044 20.8294 7.30504C21.8208 9.16964 22.1965 11.3002 21.9026 13.3915M2.09733 13.3914C1.80343 11.3002 2.17911 9.16955 3.17053 7.30494C4.16196 5.44034 5.71823 3.93747 7.6163 3.01172M11.4342 6.56544L6.5656 11.4341C6.36759 11.6321 6.26859 11.7311 6.23149 11.8452C6.19886 11.9457 6.19886 12.0538 6.23149 12.1543C6.26859 12.2684 6.36759 12.3674 6.5656 12.5654L11.4342 17.4341C11.6322 17.6321 11.7312 17.7311 11.8454 17.7682C11.9458 17.8008 12.054 17.8008 12.1544 17.7682C12.2686 17.7311 12.3676 17.6321 12.5656 17.4341L17.4342 12.5654C17.6322 12.3674 17.7312 12.2684 17.7683 12.1543C17.801 12.0538 17.801 11.9457 17.7683 11.8452C17.7312 11.7311 17.6322 11.6321 17.4342 11.4341L12.5656 6.56544C12.3676 6.36743 12.2686 6.26843 12.1544 6.23134C12.054 6.19871 11.9458 6.19871 11.8454 6.23134C11.7312 6.26843 11.6322 6.36743 11.4342 6.56544Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="heading-and-number">
                <div class="smpl_text-sm-medium">Number of Digital Account</div>
                <div class="number-and-badge">
                  <div
                    class="smpl_display-sm-semibold"
                    id="count-digital-account"
                  >
                    0
                  </div>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="section-header">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="heading-and-number">
                <div class="smpl_text-sm-medium">
                  Value of Digital Subscription
                </div>
                <div class="number-and-badge">
                  <div class="smpl_display-sm-semibold">
                    <sup>RM </sup>
                    <span id="count-value-subscription-account">0</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="section-header">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="heading-and-number">
                <div class="smpl_text-sm-medium">
                  Number of Digital Subscription
                </div>
                <div class="number-and-badge">
                  <div
                    class="smpl_display-sm-semibold"
                    id="count-subscription-account"
                  >
                    0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const section3 = () => {
    return (
      <>
        <div class="smpl_section-content wf-section">
          <div class="table_overview">
            <div class="content_overview_digital-subscribtions">
              <div class="card-header-2">
                <div class="content-33">
                  <div class="smpl-icon-featured-outline-large">
                    <div class="icon-featured-medium w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                          stroke="#3118D3"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="text-and-supporting-text-19">
                    <div class="text-and-badge-copy">
                      <div class="smpl_text-lg-semibold">Digital Accounts</div>
                      <div class="smpl_text-sm-medium text-align-left">
                        Accounts where you keep your assets with value and can
                        be passed on to your beloved ones.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DigitalSummaryCard typeName="digital" summary={summary} />
            </div>
            <div class="content_overview_digitalaccounts">
              <div class="card-header-2">
                <div class="content-33">
                  <div class="smpl-icon-featured-outline-large">
                    <div class="icon-featured-medium w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewbox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.8778 20.0899C16.1693 21.3312 14.1117 21.9998 11.9999 21.9998C9.88812 21.9998 7.83054 21.3312 6.12206 20.0899M16.3836 3.01182C18.2817 3.93756 19.838 5.44044 20.8294 7.30504C21.8208 9.16964 22.1965 11.3002 21.9026 13.3915M2.09733 13.3914C1.80343 11.3002 2.17911 9.16955 3.17053 7.30494C4.16196 5.44034 5.71823 3.93747 7.6163 3.01172M11.4342 6.56544L6.5656 11.4341C6.36759 11.6321 6.26859 11.7311 6.23149 11.8452C6.19886 11.9457 6.19886 12.0538 6.23149 12.1543C6.26859 12.2684 6.36759 12.3674 6.5656 12.5654L11.4342 17.4341C11.6322 17.6321 11.7312 17.7311 11.8454 17.7682C11.9458 17.8008 12.054 17.8008 12.1544 17.7682C12.2686 17.7311 12.3676 17.6321 12.5656 17.4341L17.4342 12.5654C17.6322 12.3674 17.7312 12.2684 17.7683 12.1543C17.801 12.0538 17.801 11.9457 17.7683 11.8452C17.7312 11.7311 17.6322 11.6321 17.4342 11.4341L12.5656 6.56544C12.3676 6.36743 12.2686 6.26843 12.1544 6.23134C12.054 6.19871 11.9458 6.19871 11.8454 6.23134C11.7312 6.26843 11.6322 6.36743 11.4342 6.56544Z"
                          stroke="#3118D3"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="text-and-supporting-text-19">
                    <div class="text-and-badge-copy">
                      <div class="smpl_text-lg-semibold">
                        Digital Subscriptions
                      </div>
                      <div class="smpl_text-sm-medium text-align-left">
                        Account where you make payment for subscription and to
                        be terminated at the point of death.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DigitalSummaryCard typeName="subscription" summary={summary} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const section4 = () => {
    return (
      <>
        <div class="component-wasiat-ads">
          <div class="row">
            <div class="d-flex flex-wrap mb-1">
              <div class="flex-grow-1 mb-1">
                <h3 class="smpl_display-sm-semibold">
                  Start generating wasiat/will
                </h3>
                <div class="div-block-11">
                  <div class="smpl_text-md-regular">Last wasiat update :</div>
                  <div
                    class="smpl_text-md-regular text-color-primary700"
                    id="last-updated-will"
                  >
                    -
                  </div>
                </div>
              </div>
              <WillActionButtons
                setQrValue={setQrValue}
                cardRef={cardRef}
                showQrModal={true}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">Welcome back,</div>
              <div class="smpl_display-sm-semibold text-color-primary700">
                {user?.profile?.username}
              </div>
            </div>
            <div class="smpl_text-md-regular">
              Overview of secured assets in your Sampul
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const qrCodeModal = () => {
    return (
      <div class="modal fade" id="qr-code-modal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Your Wasiat/will QR code</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="text-center">
                <div ref={cardRef}>
                  {qrValue !== null && (
                    <QRCode
                      title="Sampul"
                      value={qrValue}
                      bgColor={'#FFFFFF'}
                      fgColor={'#000000'}
                      size={400}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="body">
      {qrCodeModal()}
      <Breadcrumb pageName={'Dashboard'} />
      <div class="mt-4">{title()}</div>
      <div class="mt-4">{section2()}</div>
      <div class="mt-4">{section3()}</div>
      <div class="mt-4">{section4()}</div>
      <Footer />
    </div>
  );
};

export default Dashboard;
