import { useEffect, useState } from 'react';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import { formatTimestamp, mapViewElements } from '../utils/helpers';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import WillActionButtons from '../components/WillActionButtons';
import SideBar from '../components/SideBar';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import BelovedModal from '../components/BelovedModal';
import ProfileModal from '../components/ProfileModal';
import { Tooltip } from 'react-tooltip';
import { useApi } from '../context/api';

const Dashboard = () => {
  const { contextApiData } = useApi();

  const [summary, setSummary] = useState({
    data: null,
    isReady: false,
  });

  const [qrValue, setQrValue] = useState(null);
  const [belovedCategory, setBelovedCategory] = useState('co_sampul');

  const mapDigitalAssets = async () => {
    const singleData = {};
    singleData.digital_account = [];
    singleData.subscription_account = [];
    contextApiData.digitalAssets.data.forEach((item) => {
      if (item.account_type === 'non_subscription') {
        singleData.digital_account.push(item);
      }
      if (item.account_type === 'subscription') {
        singleData.subscription_account.push(item);
      }
    });
    singleData.count_digital = singleData.digital_account.length;
    singleData.count_subscription = singleData.subscription_account.length;
    singleData.count_value_digital = `RM ${singleData.digital_account
      .reduce((acc, val) => acc + val.declared_value_myr, 0)
      .toLocaleString()}`;
    singleData.count_value_subscription = `RM ${singleData.subscription_account
      .reduce((acc, val) => acc + val.declared_value_myr, 0)
      .toLocaleString()}`;

    const displayElements = {
      count_value_digital: document.getElementById(
        'count-value-digital-account'
      ),
      count_digital: document.getElementById('count-digital-account'),
      count_value_subscription: document.getElementById(
        'count-value-subscription-account'
      ),
      count_subscription: document.getElementById('count-subscription-account'),
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
    if (contextApiData.profile.isLoading == false) {
      mapDigitalAssets();
    }
  }, [contextApiData.digitalAssets.isLoading]);

  const numberUI = ({ number, title }) => {
    return (
      <div class="div-block-43">
        <div class="smpl-icon-featured-outline-large">
          <div class="smpl_text-lg-semibold text-center flexchild-align-centre text-color-primary700">
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      image: <img width="180px" src="images/task_management.png" />,
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      image: (
        <img width="100px" src="images/joyful_people_show_victory_hand.png" />
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
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      image: <img width="120px" src="images/iphone_nft_blockchain.png" />,
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
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
      image: <img width="180px" src="images/couple_walks_with_baby.png" />,
    },
  };

  const actionUI = ({ key = 'complete_profile' }) => {
    return (
      <div class="card-body get-started-bg">
        <span class="smpl_text-lg-semibold text-align-left">
          {getStartedKey[key].title}
        </span>

        <p class="smpl_text-sm-regular max-width-full">
          {getStartedKey[key].description}
        </p>

        <div class="row">
          <div class="col-md col-sm-12  mt-auto">
            <button
              type="button"
              class="btn btn-primary btn-text btn-lg"
              onClick={getStartedKey[key].btnFunction}
            >
              <Loading title={getStartedKey[key].btnTitle} />
            </button>
          </div>
          <div class="col text-end">{getStartedKey[key].image}</div>
        </div>
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
            <div class="col-lg-7 col-12 mt-lg-0 mt-3">
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

  const summaryValueCard = ({
    title = '',
    id_of_value = '',
    tooltip_html = '',
    image_path = 'images/like.png',
  }) => {
    return (
      <div class="card" style={{ minHeight: 250 }}>
        <div class="row mb-4">
          <div class="col">
            <div>
              <img width="40px" src={image_path} />
            </div>
          </div>
          <div class="col text-end">
            <b
              data-tooltip-id={`my-tooltip-1-${id_of_value}`}
              data-tooltip-html={tooltip_html}
            >
              <i class="bi bi-info-circle"></i>
            </b>
            <Tooltip
              id={`my-tooltip-1-${id_of_value}`}
              place="bottom"
              style={{
                backgroundColor: 'black',
                color: 'white',
                'border-radius': '10px',
                'z-index': '100000',
              }}
            />
          </div>
        </div>

        <div class="heading-and-number">
          <div class="smpl_text-lg-semibold">{title}</div>
          <div class="number-and-badge">
            <div class="h2 text-truncate">
              <span id={id_of_value}>0</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const section2 = () => {
    return (
      <>
        <div class="smpl_section-content wf-section">
          <div class="metric-group">
            {summaryValueCard({
              title: 'Digital Accounts Value',
              id_of_value: 'count-value-digital-account',
              tooltip_html: '<div>How much value of my Digital Account?</div>',
            })}

            {summaryValueCard({
              title: 'Digital Accounts',
              id_of_value: 'count-digital-account',
              tooltip_html: '<div>How many Digital Account that I have??</div>',
            })}

            {summaryValueCard({
              title: 'Digital Subscriptions Value',
              id_of_value: 'count-value-subscription-account',
              tooltip_html:
                '<div>How much value of my Digital Subscriptions Account?</div>',
              image_path: 'images/like_pink.png',
            })}

            {summaryValueCard({
              title: 'Digital Subscriptions',
              id_of_value: 'count-subscription-account',
              tooltip_html:
                '<div>How many Digital Subscriptions Account that I have?</div>',
              image_path: 'images/like_pink.png',
            })}
          </div>
        </div>
      </>
    );
  };

  const section3 = () => {
    return (
      <>
        <div>
          <div class="table_overview">
            <div class="content_overview_digital-subscribtions">
              <div class="card-header-2">
                <div class="content-33">
                  <img
                    width="50px"
                    src="images/pink_loading_sign_on_green_square.png"
                  />
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
              <DigitalSummaryCard typeName="digital" />
            </div>
            <div class="content_overview_digitalaccounts">
              <div class="card-header-2">
                <div class="content-33">
                  <img width="50px" src="images/pink_play_button.png" />
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
              <DigitalSummaryCard typeName="subscription" />
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
                  <div class="smpl_text-md-regular text-color-primary700">
                    {contextApiData.will.data?.last_updated
                      ? formatTimestamp(contextApiData.will.data?.last_updated)
                      : ''}
                  </div>
                </div>
                <WillActionButtons />
              </div>
              <img width="300px" src="images/will_dashboard.png" />
            </div>
          </div>
        </div>
      </>
    );
  };

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              Welcome back,{' '}
              <span class="smpl_display-sm-semibold text-color-primary700">
                {contextApiData.profile.data?.username}
              </span>
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
          />
          <DigitalAssetsModal keyType={'add'} selectedItem={null} />
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
