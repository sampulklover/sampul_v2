import BelovedModal from '../components/BelovedModal';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import InviteModal from '../components/InviteModal';
import Loading from '../components/Laoding';
import SideBar from '../components/SideBar';
import { addUserImg, emptyUserImg } from '../constant/element';
import {
  belovedInviteStatus,
  belovedLevel,
  relationships,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Beloved = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const router = useRouter();

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              {translations[locale].beloved.appoint_your_trusted_}
            </div>
            <div class="smpl_text-md-regular">
              {translations[locale].beloved.ensure_your_assets_}
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const setBelovedModal = (item, category) => {
    setValueTempData('beloved', {
      ...tempData.invite,
      key: item ? 'edit' : 'add',
      category: category ? category : 'co_sampul',
      selectedItem: item ? item : null,
    });
    toggleModal('beloved');
  };

  const loadingTable = ({ condition }) => {
    if (condition == false) {
      return (
        <div class="my-3 text-center">
          <Loading loading={true} />
        </div>
      );
    }

    return '';
  };

  const belovedCard = () => {
    var coSampulData = [];
    var guardianData = [];

    return (
      <>
        <div class="accordion" id="accordion1">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <h3 class="heading-xsmall">
                  {translations[locale].beloved.co_sampul}
                </h3>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordion1"
            >
              {loadingTable({ condition: !contextApiData.beloved.isLoading })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {contextApiData.beloved.data?.map((item, index) => {
                      if (item.type == 'co_sampul') {
                        coSampulData.push(item);
                        // const rObject = relationships().find(
                        //   (x) => x.value === item.relationship
                        // );
                        const lObject = belovedLevel().find(
                          (x) => x.value === item.level
                        );

                        var status_invites = null;

                        if (item.beloved_invites.length > 0) {
                          status_invites = belovedInviteStatus().find(
                            (x) =>
                              x.value === item.beloved_invites[0].invite_status
                          );
                        }

                        const imageUrl = item.image_path
                          ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                          : emptyUserImg;

                        return (
                          <tr key={index}>
                            <div
                              class="d-flex flex-wrap table-hover py-3 ps-3 px-3"
                              onClick={() => {
                                setBelovedModal(item, 'co_sampul');
                              }}
                            >
                              <div class="dp-image-wrapper">
                                <img
                                  loading="lazy"
                                  src={imageUrl}
                                  alt=""
                                  class="dp-image"
                                />
                              </div>
                              <div class="flex-grow-1">
                                <div class="smpl_text-sm-semibold crop-text">
                                  <span>{item.name}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{item?.email ? item.email : '-'}</span>
                                </div>
                              </div>

                              <div class="beloved-tag">
                                {status_invites ? (
                                  <div class="badge is-badge-small">
                                    <span>
                                      {
                                        translations[locale]?.global[
                                          status_invites.value
                                        ]
                                      }
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                <div class="badge is-badge-small">
                                  <span>
                                    {
                                      translations[locale]?.global[
                                        lObject.value
                                      ]
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <div
                  style={{
                    display: coSampulData.length < 2 ? 'block' : 'none',
                  }}
                  class="card-copy cosampul-copy"
                  onClick={() => {
                    if (coSampulData.length < 2) {
                      setBelovedModal(null, 'co_sampul');
                    } else {
                      toast.error(
                        translations[locale].beloved.you_have_reached_,
                        {
                          duration: 6000,
                        }
                      );
                    }
                  }}
                >
                  <div class="beloved-block">
                    <div class="dp-image-wrapper">
                      <div class="smpl-icon-featured-outline-large">
                        <div class="uui-icon-1x1-xsmall-2 w-embed">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        {translations[locale].beloved.add_your_co_sampul}
                      </div>
                      <div class="smpl_text-sm-regular">
                        {translations[locale].beloved.co_sampul_is_your}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion mt-3" id="accordion2">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <h3 class="heading-xsmall">
                  {translations[locale].beloved.beneficiaries}
                </h3>
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordion2"
            >
              {loadingTable({ condition: !contextApiData.beloved.isLoading })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {contextApiData.beloved.data?.map((item, index) => {
                      if (item.type == 'future_owner') {
                        // const rObject = relationships().find(
                        //   (x) => x.value === item.relationship
                        // );

                        var status_invites = null;
                        if (item.beloved_invites.length > 0) {
                          status_invites = belovedInviteStatus().find(
                            (x) =>
                              x.value === item.beloved_invites[0].invite_status
                          );
                        }

                        const imageUrl = item.image_path
                          ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                          : emptyUserImg;

                        return (
                          <tr key={index}>
                            <div
                              class="d-flex flex-wrap table-hover py-3 ps-3 px-3"
                              onClick={() => {
                                setBelovedModal(item, 'future_owner');
                              }}
                            >
                              <div class="dp-image-wrapper">
                                <img
                                  loading="lazy"
                                  src={imageUrl}
                                  alt=""
                                  class="dp-image"
                                />
                              </div>
                              <div class="flex-grow-1">
                                <div class="smpl_text-sm-semibold crop-text">
                                  <span>{item.name}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{item?.email ? item.email : '-'}</span>
                                </div>
                              </div>
                            </div>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <div
                  class="card-copy cosampul-copy"
                  onClick={() => {
                    setBelovedModal(null, 'future_owner');
                  }}
                >
                  <div class="beloved-block">
                    <div class="dp-image-wrapper">
                      <div class="smpl-icon-featured-outline-large">
                        <div class="uui-icon-1x1-xsmall-2 w-embed">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        {translations[locale].beloved.add_your_beneficiary}
                      </div>
                      <div class="smpl_text-sm-regular">
                        {translations[locale].beloved.the_future_owner}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion mt-3" id="accordion3">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="true"
                aria-controls="collapseThree"
              >
                <h3 class="heading-xsmall">
                  {translations[locale].beloved.guardians}
                </h3>
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordion3"
            >
              {loadingTable({ condition: !contextApiData.beloved.isLoading })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {contextApiData.beloved.data?.map((item, index) => {
                      if (item.type == 'guardian') {
                        guardianData.push(item);

                        // const rObject = relationships().find(
                        //   (x) => x.value === item.relationship
                        // );

                        const lObject = belovedLevel().find(
                          (x) => x.value === item.level
                        );

                        var status_invites = null;
                        if (item.beloved_invites.length > 0) {
                          status_invites = belovedInviteStatus().find(
                            (x) =>
                              x.value === item.beloved_invites[0].invite_status
                          );
                        }

                        const imageUrl = item.image_path
                          ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                          : emptyUserImg;

                        return (
                          <tr key={index}>
                            <div
                              class="d-flex flex-wrap table-hover py-3 ps-3 px-3"
                              onClick={() => {
                                setBelovedModal(item, 'guardian');
                              }}
                            >
                              <div class="dp-image-wrapper">
                                <img
                                  loading="lazy"
                                  src={imageUrl}
                                  alt=""
                                  class="dp-image"
                                />
                              </div>
                              <div class="flex-grow-1">
                                <div class="smpl_text-sm-semibold crop-text">
                                  <span>{item.name}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{item?.email ? item.email : '-'}</span>
                                </div>
                              </div>
                              <div class="beloved-tag">
                                <div class="badge is-badge-small">
                                  <span>{lObject.name}</span>
                                </div>
                              </div>
                            </div>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <div
                  class="card-copy cosampul-copy"
                  style={{
                    display: guardianData.length < 2 ? 'block' : 'none',
                  }}
                  onClick={() => {
                    if (checkRestriction()) {
                      router.push('settings?tab=nav-billing-tab');
                    } else {
                      setBelovedModal(null, 'guardian');
                    }
                  }}
                >
                  <div class="beloved-block">
                    <div class="dp-image-wrapper">
                      <div class="smpl-icon-featured-outline-large">
                        <div class="uui-icon-1x1-xsmall-2 w-embed">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        {translations[locale].beloved.add_your_guardian}{' '}
                        {checkRestriction() ? (
                          <span class="text-primary">
                            {translations[locale].beloved.upgrade_your_plan}
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                      <div class="smpl_text-sm-regular">
                        {translations[locale].beloved.the_caretaker_of_}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion mt-3" id="accordion4">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="true"
                aria-controls="collapseFour"
              >
                <h3 class="heading-xsmall">
                  {translations[locale].beloved.i_am_a_}
                </h3>
              </button>
            </h2>
            <div
              id="collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#accordion3"
            >
              {loadingTable({ condition: !contextApiData.invites.isLoading })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {contextApiData.invites.data?.map((item, index) => {
                      var status_invites = null;
                      if (item.invite_status?.length > 0) {
                        status_invites = belovedInviteStatus().find(
                          (x) => x.value === item.invite_status
                        );
                      }

                      const imageUrl = item.profiles.image_path
                        ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.profiles.image_path}`
                        : emptyUserImg;

                      return (
                        <tr key={index}>
                          <div
                            class="d-flex flex-wrap table-hover py-3 ps-3 px-3"
                            onClick={() => {
                              setValueTempData('invite', {
                                ...tempData.invite,
                                selectedItem: item ? item : null,
                              });
                              toggleModal('invite');
                            }}
                          >
                            <div class="dp-image-wrapper">
                              <img
                                loading="lazy"
                                src={imageUrl}
                                alt=""
                                class="dp-image"
                              />
                            </div>
                            <div class="flex-grow-1">
                              <div class="smpl_text-sm-semibold crop-text">
                                <span>{item.profiles.username}</span>
                              </div>
                              <div class="smpl_text-sm-regular crop-text">
                                <span>{item.profiles.email}</span>
                              </div>
                            </div>
                            <div class="beloved-tag">
                              {status_invites ? (
                                <div class="badge is-badge-small">
                                  <span>{status_invites.name}</span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const checkRestriction = () => {
    var restricted = true;

    if (
      contextApiData.account.data?.products?.access_control?.pages.beloved
        .guardian.access
    ) {
      restricted = false;
    } else {
      restricted = true;
    }

    return restricted;
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb pageName={translations[locale].beloved.beloved} />
          <div class="mt-4">{title()}</div>
          <div
            class="row mt-4"
            style={{ 'align-items': 'center', display: 'flex' }}
          >
            <div class="col-lg align-self-start">{belovedCard()}</div>
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
        <Footer />
      </div>
    </SideBar>
  );
};

export default Beloved;

// Summary for this page includes:
// The "Beloved" page allows users to manage trusted individuals who can handle their assets in the future.
// Users can add, view, and edit profiles categorized as Co-Sampul (trusted individuals), Beneficiaries (future asset owners), and Guardians (caretakers).
// Each category is collapsible for easy navigation, displaying relevant details like names, emails, and status indicators.
// Users can also manage invitations and access control based on their subscription plan.
// The page features includes modals for adding and editing profiles.
