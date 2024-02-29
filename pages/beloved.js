import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import {
  belovedInviteStatus,
  belovedLevel,
  instructionsAfterDeath,
  relationships,
  servicePlatforms,
} from '../constant/enum';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import BelovedModal from '../components/BelovedModal';
import { addUserImg, emptyUserImg } from '../constant/element';
import SideBar from '../components/SideBar';
import InviteModal from '../components/InviteModal';

const Beloved = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [summary, setSummary] = useState({
    data: [],
    isReady: false,
  });
  const [inviteList, setInviteList] = useState({
    data: [],
    isReady: false,
  });

  const [isReady, setIsReady] = useState(true);
  const [runEffect, setRunEffect] = useState(false);
  const [belovedModalType, setBelovedModalType] = useState({
    key: 'add',
    selectedItem: null,
    category: 'co_sampul',
  });
  const [inviteModalType, setInviteModalType] = useState({
    key: 'edit',
    selectedItem: null,
    category: 'invite',
  });

  const getBeloved = async () => {
    const { data, error } = await supabase
      .from('beloved')
      .select('*, beloved_invites (*)')
      .eq('uuid', user?.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      setSummary({
        data: [],
        isReady: true,
      });
      toast.error(error.message);
      return;
    }

    setSummary({
      data: data,
      isReady: true,
    });
  };

  const getInvites = async () => {
    try {
      const response = await fetch('/api/beloved/invite-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.profile.email,
        }),
      });

      if (!response.ok) {
        toast.error('Something went wrong!');
        setInviteList({
          data: [],
          isReady: true,
        });
        return;
      }

      const { data } = await response.json();
      setInviteList({
        data: data,
        isReady: true,
      });
    } catch (error) {
      toast.error(error.message);
      setInviteList({
        data: [],
        isReady: true,
      });
    }
  };

  const initFunction = () => {
    getBeloved();
    getInvites();
  };

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      initFunction();
    }
  }, [user, runEffect]);

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">
                Appoint your trusted person
              </div>
            </div>
            <div class="smpl_text-md-regular">
              Ensure your assets is well managed later
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const inviteModal = (item, category) => {
    $('#invite-modal')?.modal('show');
    setInviteModalType({
      key: 'edit',
      selectedItem: item ? item : null,
      category: category,
    });
  };

  const belovedModal = (item, category) => {
    $('#beloved-modal')?.modal('show');
    setBelovedModalType({
      key: item ? 'edit' : 'add',
      selectedItem: item ? item : null,
      category: category,
    });

    const inputElements = {
      beloved_modal: {
        nric_name: document.getElementById('input-beloved-nric-name'),
        nric_no: document.getElementById('input-beloved-nric-no'),
        nickname: document.getElementById('input-beloved-nickname'),
        phone_no: document.getElementById('input-beloved-phone-no'),
        email: document.getElementById('input-beloved-email'),
        relationship: document.getElementById('select-beloved-relationship'),
        type: document.getElementById('select-beloved-type'),
        level: document.getElementById('select-beloved-level'),
        image_path: document.getElementById('preview-beloved-image'),
      },
    };

    for (const key in inputElements.beloved_modal) {
      if (key == 'image_path') {
        inputElements.beloved_modal[key].src = addUserImg;
      } else {
        inputElements.beloved_modal[key].value = '';
      }
    }

    if (item) {
      for (const key in inputElements.beloved_modal) {
        inputElements.beloved_modal[key].value = item[key];

        if (key == 'image_path') {
          const imageUrl = item[key]
            ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item[key]}`
            : addUserImg;
          inputElements.beloved_modal.image_path.src = imageUrl;
        }
      }
    } else {
      if (category) {
        inputElements.beloved_modal.type.value = category;
      }
    }
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
                <h3 class="heading-xsmall">Co-Sampul</h3>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordion1"
            >
              {loadingTable({ condition: summary.isReady })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {summary.data.map((item, index) => {
                      if (item.type == 'co_sampul') {
                        coSampulData.push(item);
                        const rObject = relationships().find(
                          (x) => x.value === item.relationship
                        );
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
                                belovedModal(item, 'co_sampul');
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
                                  <span>{item.nickname}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{rObject.name}</span>
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
                  onClick={() => {
                    if (coSampulData.length <= 2) {
                      belovedModal(null, 'co_sampul');
                    } else {
                      toast.error(
                        'You have reached the maximum limit of two co-sampul. To add more, you must first delete existing ones.',
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
                            viewbox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        Add your Co-Sampul
                      </div>
                      <div class="smpl_text-sm-regular">
                        Co-Sampul is your trusted person for whom which all
                        information in this Sampul will be passed on.
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
                <h3 class="heading-xsmall">Beneficiaries</h3>
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordion2"
            >
              {loadingTable({ condition: summary.isReady })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {summary.data.map((item, index) => {
                      if (item.type == 'future_owner') {
                        const rObject = relationships().find(
                          (x) => x.value === item.relationship
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
                                belovedModal(item, 'future_owner');
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
                                  <span>{item.nickname}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{rObject.name}</span>
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
                      }
                    })}
                  </tbody>
                </table>
                <div
                  class="card-copy cosampul-copy"
                  onClick={() => {
                    belovedModal(null, 'future_owner');
                  }}
                >
                  <div class="beloved-block">
                    <div class="dp-image-wrapper">
                      <div class="smpl-icon-featured-outline-large">
                        <div class="uui-icon-1x1-xsmall-2 w-embed">
                          <svg
                            width="24"
                            height="24"
                            viewbox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        Add your Beneficiary
                      </div>
                      <div class="smpl_text-sm-regular">
                        The future owner of your assets
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
                <h3 class="heading-xsmall">Guardians</h3>
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordion3"
            >
              {loadingTable({ condition: summary.isReady })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {summary.data.map((item, index) => {
                      if (item.type == 'guardian') {
                        const rObject = relationships().find(
                          (x) => x.value === item.relationship
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
                                belovedModal(item, 'guardian');
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
                                  <span>{item.nickname}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>{rObject.name}</span>
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
                      }
                    })}
                  </tbody>
                </table>
                <div
                  class="card-copy cosampul-copy"
                  onClick={() => {
                    if (checkRestriction()) {
                      router.push('settings?tab=nav-billing-tab');
                    } else {
                      belovedModal(null, 'guardian');
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
                            viewbox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="smpl_text-sm-semibold">
                        Add your Guardian{' '}
                        {checkRestriction() ? (
                          <span class="text-primary">(Upgrade your plan)</span>
                        ) : (
                          ''
                        )}
                      </div>
                      <div class="smpl_text-sm-regular">
                        The caretaker of your underage kids ensuring they get
                        the best care after you and you spoused demised
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
                <h3 class="heading-xsmall">I am a co-sampul for</h3>
              </button>
            </h2>
            <div
              id="collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#accordion3"
            >
              {loadingTable({ condition: inviteList.isReady })}
              <div class="pointer-on-hover">
                <table class="table table-hover mb-0">
                  <tbody>
                    {inviteList.data.map((item, index) => {
                      var status_invites = null;
                      if (item.invite_status.length > 0) {
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
                              inviteModal(item, 'invite');
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

    if (user.access_control?.pages.beloved.guardian.access) {
      restricted = false;
    } else {
      restricted = true;
    }

    return restricted;
  };

  return (
    <SideBar>
      <div class="body">
        <div class="content">
          <Breadcrumb pageName={'Beloved'} />
          <InviteModal
            keyType={inviteModalType.key}
            category={inviteModalType.category}
            selectedItem={inviteModalType.selectedItem}
            refreshFunction={initFunction}
          />
          <BelovedModal
            keyType={belovedModalType.key}
            category={belovedModalType.category}
            selectedItem={belovedModalType.selectedItem}
            refreshFunction={initFunction}
          />
          <div class="mt-4">{title()}</div>
          <div class="row mt-4">
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
