import {
  belovedInviteStatus,
  belovedLevel,
  beneficiaryTypes,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const type_title = {
  invite: {
    title: 'asdasd',
    subtitle: `vdevvdvr`,
    display_level: '',
  },
};

const belovedTypeName = {
  add: {
    key: 'add',
    button_title: 'Submit',
    allow_delete: false,
  },
  edit: {
    key: 'edit',
    button_title: 'Update',
    allow_delete: true,
  },
};

const getElements = () => {
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

  return inputElements;
};

const InviteModal = ({ keyType, category, selectedItem }) => {
  const { contextApiData, getInvites } = useApi();
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState({
    reject: false,
    approve: false,
  });
  const [belovedItem, setBelovedItem] = useState({
    data: null,
    isReady: false,
  });

  const currentStatus = (item) => {
    var status_invites = null;
    if (item?.invite_status) {
      status_invites = belovedInviteStatus().find(
        (x) => x.value === item.invite_status
      ).name;
    }

    return status_invites;
  };

  const getBelovedItem = async () => {
    try {
      const response = await fetch('/api/beloved/invite-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beloved_id: selectedItem.beloved_id,
        }),
      });

      if (!response.ok) {
        toast.error(translations[locale].global.something_went_wrong_);
        setBelovedItem({
          data: null,
          isReady: true,
        });
        return;
      }

      const { data } = await response.json();

      setBelovedItem({
        data: data,
        isReady: true,
      });
    } catch (error) {
      toast.error(error.message);
      setBelovedItem({
        data: null,
        isReady: true,
      });
    }
  };

  useEffect(() => {
    if (selectedItem) {
      getBelovedItem();
    }
  }, [selectedItem?.id]);

  const keyValue = {
    level: belovedLevel().find((x) => x.value === belovedItem.data?.level)
      ?.name,
    type: beneficiaryTypes().find((x) => x.value === belovedItem.data?.type)
      ?.name,
    from_nric_name: belovedItem.data?.profiles?.nric_name,
  };

  const updateStatus = async (key, status) => {
    setIsLoading({
      ...isLoading,
      [key]: true,
    });

    try {
      const response = await fetch('/api/beloved/status-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invite_uuid: selectedItem.invite_uuid,
          invite_status: status,
          invited_uuid: contextApiData.user.data?.id,
        }),
      });

      if (!response.ok) {
        toast.error(translations[locale].global.something_went_wrong_);
        setBelovedItem({
          data: null,
          isReady: true,
        });
        return;
      }

      // const { data } = await response.json();

      setIsLoading({
        ...isLoading,
        [key]: false,
      });
      $('#invite-modal')?.modal('hide');
      getInvites();
    } catch (error) {
      toast.error(error.message);
      setIsLoading({
        ...isLoading,
        [key]: false,
      });
    }
  };

  const buttonConfig = {
    approve: {
      title: translations[locale].component.invite_modal.reject,
      loading: isLoading.approve,
      action: () => {
        var is_completed = checkCompleteProfile();
        if (is_completed) {
          updateStatus('approve', 'rejected');
        } else {
          toast.error(
            translations[locale].component.invite_modal.to_reject_the_
          );
        }
      },
    },
    reject: {
      title: translations[locale].component.invite_modal.accept,
      loading: isLoading.reject,
      action: () => {
        var is_completed = checkCompleteProfile();
        if (is_completed) {
          updateStatus('reject', 'accepted');
        } else {
          toast.error(
            translations[locale].component.invite_modal.to_accept_the_
          );
        }
      },
    },
  };

  const checkCompleteProfile = () => {
    var is_completed = false;
    if (
      contextApiData.profile.data?.nric_name &&
      contextApiData.profile.data?.nric_no
    ) {
      is_completed = true;
    } else {
      is_completed = false;
    }
    return is_completed;
  };

  return (
    <div class="modal fade" id="invite-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {translations[locale].component.invite_modal.i_am_a_}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="modal-header-2 mb-3">
              <div class="content-32">
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
                        d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                        stroke="#3118D3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                {belovedItem.isReady ? (
                  <div class="text-and-supporting-text-18">
                    <div class="text-lg-semibold-4">
                      {/* {type_title[category].title}  */}
                      {keyValue.level} {keyValue.type}
                    </div>
                    <div class="text-sm-regular-6">
                      {/* {type_title[category].subtitle} */}
                      <p>
                        {
                          translations[locale].component.invite_modal
                            .we_are_delighted_
                        }
                        {keyValue.level} {keyValue.type}{' '}
                        {translations[locale].component.invite_modal.for}{' '}
                        {keyValue.from_nric_name}.{' '}
                        {
                          translations[locale].component.invite_modal
                            .we_hope_that_
                        }{' '}
                        {keyValue.from_nric_name}{' '}
                        {
                          translations[locale].component.invite_modal
                            .on_the_appointment_
                        }
                      </p>
                      <p />
                      {
                        translations[locale].component.invite_modal
                          .briefly_your_responsibilities_
                      }{' '}
                      {keyValue.from_nric_name}
                      {
                        translations[locale].component.invite_modal
                          .wasiat_will_which_
                      }{' '}
                      <Link href="/">
                        {translations[locale].component.invite_modal.here}
                      </Link>{' '}
                      {
                        translations[locale].component.invite_modal
                          .for_the_process_
                      }
                      <p />
                    </div>
                    <div class="text-sm-regular-6">
                      {
                        translations[locale].component.invite_modal
                          .current_status_
                      }{' '}
                      <b>{currentStatus(selectedItem)}</b>
                    </div>
                  </div>
                ) : (
                  <Loading loading={true} />
                )}
              </div>

              <div class="padding-bottom-3"></div>
            </div>
            <div class="d-grid gap-2 mt-5">
              {selectedItem?.invite_status == 'accepted' ? (
                <button
                  type="button"
                  class={`btn ${
                    checkCompleteProfile() ? 'btn-primary' : 'btn-secondary'
                  } btn-text`}
                  onClick={buttonConfig.approve.action}
                >
                  <Loading
                    title={buttonConfig.approve.title}
                    loading={buttonConfig.approve.loading}
                  />
                </button>
              ) : (
                <button
                  type="submit"
                  class={`btn ${
                    checkCompleteProfile() ? 'btn-primary' : 'btn-secondary'
                  } btn-text`}
                  onClick={buttonConfig.reject.action}
                >
                  <Loading
                    title={buttonConfig.reject.title}
                    loading={buttonConfig.reject.loading}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;

// The summary of this page includes:
// This page is designed to manages invitations for a specific category of beneficiaries.
// It allows users to interact with invitations through various actions like approving or rejecting them.
// The component fetches data from an API to display details about the invitation and the beneficiary involved.
// Users can update the status of invitations, such as approving or rejecting them, with feedback displayed through toast notifications.
// The interface dynamically adjusts based on whether the beneficiary's profile is complete, guiding users to complete their profiles if necessary.
