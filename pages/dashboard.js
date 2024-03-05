import { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import { mapViewElements } from '../utils/helpers';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import WillActionButtons from '../components/WillActionButtons';
import QrCodeModal from '../components/QrCodeModal';
import SideBar from '../components/SideBar';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import BelovedModal from '../components/BelovedModal';
import ProfileModal from '../components/ProfileModal';

const Dashboard = () => {
  const { user } = useUser();
  const cardRef = useRef(null);
  const [summary, setSummary] = useState({
    data: null,
    isReady: false,
  });
  const [isReady, setIsReady] = useState(true);
  const [runEffect, setRunEffect] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [belovedCategory, setBelovedCategory] = useState('co_sampul');

  const initiateFunction = async () => {
    const { data: singleData, error } = await supabase
      .from('profiles')
      .select(`*, beloved ( * ), digital_assets ( * ), wills ( * )`)
      .eq('uuid', user?.uuid)
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
    singleData.count_value_digital = singleData.digital_account
      .reduce((acc, val) => acc + val.declared_value_myr, 0)
      .toLocaleString();
    singleData.count_value_subscription = singleData.subscription_account
      .reduce((acc, val) => acc + val.declared_value_myr, 0)
      .toLocaleString();

    const modifiedBelovedData = singleData.beloved.map((item) => ({
      value: item.id,
      name: item.nric_name,
    }));

    singleData.belovedDropdownData = modifiedBelovedData;

    const displayElements = {
      count_value_digital: document.getElementById(
        'count-value-digital-account'
      ),
      count_digital: document.getElementById('count-digital-account'),
      count_value_subscription: document.getElementById(
        'count-value-subscription-account'
      ),
      count_subscription: document.getElementById('count-subscription-account'),
      last_updated: document.getElementById('last-updated-will'),
    };

    var mapData = singleData;
    mapViewElements({
      source: mapData,
      target: displayElements,
      viewOnly: true,
    });

    setSummary({
      data: singleData,
      isReady: true,
    });
  };

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      initiateFunction();
    }
  }, [user, runEffect]);

  const numberUI = ({ number, title }) => {
    return (
      <div class="div-block-43">
        <div class="smpl-icon-featured-outline-large">
          <div class="smpl_text-lg-semibold align-center flexchild-align-centre text-color-primary700">
            {number}
          </div>
        </div>
        <div class="smpl_text-lg-semibold flexchild-align-centre">{title}</div>
      </div>
    );
  };

  const getStartedKey = {
    complete_profile: {
      title: 'Complete profile',
      description:
        'Complete the information on your profile and get verified to generate and download your wasiat/will',
      btnTitle: 'Edit Profile',
      btnFunction: () => {
        try {
          $('#profile-modal')?.modal('show');
        } catch (error) {
          toast.error('Something went wrong, please try again');
        }
      },
      innerIcon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5ZM11 21L14.1014 20.1139C14.2499 20.0715 14.3241 20.0502 14.3934 20.0184C14.4549 19.9902 14.5134 19.9558 14.5679 19.9158C14.6293 19.8707 14.6839 19.8161 14.7932 19.7068L21.25 13.25C21.9404 12.5597 21.9404 11.4403 21.25 10.75C20.5597 10.0596 19.4404 10.0596 18.75 10.75L12.2932 17.2068C12.1839 17.3161 12.1293 17.3707 12.0842 17.4321C12.0442 17.4866 12.0098 17.5451 11.9816 17.6066C11.9497 17.6759 11.9285 17.7501 11.8861 17.8987L11 21Z"
            stroke="#3118D3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
    register_beneficiary: {
      title: 'Register beneficiaries',
      description: 'The future owner of your assets',
      btnTitle: 'Add Beneficiary',
      btnFunction: () => {
        try {
          setBelovedCategory('future_owner');
          $('#beloved-modal')?.modal('show');
        } catch (error) {
          toast.error('Something went wrong, please try again');
        }
      },
      innerIcon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 21H9M15 21H18M17.5 6.5V14.5M3 6.2L3 14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18L17.8 18C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.7157 20.2843 3.40974 19.908 3.21799C19.4802 3 18.9201 3 17.8 3L6.2 3C5.0799 3 4.51984 3 4.09202 3.21799C3.7157 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2ZM11.5 10.5C11.5 11.8807 10.3807 13 9 13C7.61929 13 6.5 11.8807 6.5 10.5C6.5 9.11929 7.61929 8 9 8C10.3807 8 11.5 9.11929 11.5 10.5Z"
            stroke="#3118D3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
    setup_digital_assets: {
      title: 'Setup your first digital assets',
      description:
        'List and register all your Digital Assets, keep track of your assets, monitor the performance of your assets and keep track of their value',
      btnTitle: 'Add Digital Asset',
      btnFunction: () => {
        try {
          $('#digital-assets-modal')?.modal('show');
        } catch (error) {
          toast.error('Something went wrong, please try again');
        }
      },
      innerIcon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 21H9M15 21H18M17.5 6.5V14.5M3 6.2L3 14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18L17.8 18C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.7157 20.2843 3.40974 19.908 3.21799C19.4802 3 18.9201 3 17.8 3L6.2 3C5.0799 3 4.51984 3 4.09202 3.21799C3.7157 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2ZM11.5 10.5C11.5 11.8807 10.3807 13 9 13C7.61929 13 6.5 11.8807 6.5 10.5C6.5 9.11929 7.61929 8 9 8C10.3807 8 11.5 9.11929 11.5 10.5Z"
            stroke="#3118D3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
    appoint_co_sampul: {
      title: 'Appoint your Co-Sampul',
      description:
        'Co-Sampul is your trusted person for whom which all information in this Sampul will be passed on.',
      btnTitle: 'Add Co-Sampul',
      btnFunction: () => {
        try {
          setBelovedCategory('co_sampul');
          $('#beloved-modal')?.modal('show');
        } catch (error) {
          toast.error('Something went wrong, please try again');
        }
      },
      innerIcon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
            stroke="#3118D3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
  };

  const actionUI = ({ key = 'complete_profile' }) => {
    return (
      <div class="card-body get-started-bg">
        <h5 class="card-title">
          <div class="smpl-icon-featured-outline-large">
            <div class="icon-featured-medium w-embed">
              {getStartedKey[key].innerIcon}
            </div>
          </div>
        </h5>

        <p class="smpl_text-lg-semibold text-align-left">
          {getStartedKey[key].title}
        </p>

        <p class="smpl_text-sm-regular max-width-full">
          {getStartedKey[key].description}
        </p>
        <button
          type="button"
          class="btn btn-primary btn-text btn-lg"
          onClick={getStartedKey[key].btnFunction}
        >
          <Loading title={getStartedKey[key].btnTitle} />
        </button>
      </div>
    );
  };

  const section1 = () => {
    return (
      <>
        <div>
          <div class="smpl_text-lg-semibold mb-3">Getting started</div>
          <div class="row mt-md-0">
            <div class="col-lg">
              <div class="list-group" id="list-tab" role="tablist">
                <button
                  class="list-group-item list-group-item-action active"
                  id="list-home-list"
                  data-bs-toggle="list"
                  data-bs-target="#list-home"
                  role="tab"
                  aria-controls="list-home"
                >
                  {numberUI({ number: 1, title: 'Complete profile' })}
                </button>
                <button
                  class="list-group-item list-group-item-action"
                  id="list-beneficiary-list"
                  data-bs-toggle="list"
                  data-bs-target="#list-beneficiary"
                  role="tab"
                  aria-controls="list-beneficiary"
                >
                  {numberUI({
                    number: 2,
                    title: 'Register beneficiary',
                  })}
                </button>
                <button
                  class="list-group-item list-group-item-action"
                  id="list-messages-list"
                  data-bs-toggle="list"
                  data-bs-target="#list-messages"
                  role="tab"
                  aria-controls="list-messages"
                >
                  {numberUI({
                    number: 3,
                    title: 'Setup your first digital assets',
                  })}
                </button>
                <button
                  class="list-group-item list-group-item-action"
                  id="list-profile-list"
                  data-bs-toggle="list"
                  data-bs-target="#list-profile"
                  role="tab"
                  aria-controls="list-profile"
                >
                  {numberUI({ number: 4, title: 'Appoint your Co-Sampul' })}
                </button>
              </div>
            </div>
            <div class="col-md-7 col-12 mt-md-0 mt-3">
              <div class="tab-content" id="nav-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="list-home"
                  role="tabpanel"
                  aria-labelledby="list-home-list"
                >
                  {actionUI({ key: 'complete_profile' })}
                </div>
                <div
                  class="tab-pane fade"
                  id="list-beneficiary"
                  role="tabpanel"
                  aria-labelledby="list-beneficiary-list"
                >
                  {actionUI({ key: 'register_beneficiary' })}
                </div>
                <div
                  class="tab-pane fade"
                  id="list-messages"
                  role="tabpanel"
                  aria-labelledby="list-messages-list"
                >
                  {actionUI({ key: 'setup_digital_assets' })}
                </div>
                <div
                  class="tab-pane fade"
                  id="list-profile"
                  role="tabpanel"
                  aria-labelledby="list-profile-list"
                >
                  {actionUI({ key: 'appoint_co_sampul' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

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
                refreshFunction={initiateFunction}
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

  return (
    <SideBar>
      <div class="body inner-body">
        <div class="content">
          <ProfileModal category={'profile'} />
          <BelovedModal
            keyType={'add'}
            belovedType={belovedCategory}
            selectedItem={null}
            refreshFunction={initiateFunction}
          />
          <DigitalAssetsModal
            keyType={'add'}
            selectedItem={null}
            belovedList={
              summary?.data?.belovedDropdownData
                ? summary.data.belovedDropdownData
                : []
            }
          />
          <QrCodeModal cardRef={cardRef} qrValue={qrValue} />
          <Breadcrumb pageName={'Dashboard'} />
          <div class="mt-4">{title()}</div>
          <div class="mt-4">{section1()}</div>
          <div class="mt-4">{section2()}</div>
          <div class="mt-4">{section3()}</div>
          <div class="mt-4">{section4()}</div>
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default Dashboard;
