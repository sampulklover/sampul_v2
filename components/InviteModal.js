import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import {
  belovedInviteStatus,
  belovedLevel,
  beneficiaryTypes,
  relationships,
} from '../constant/enum';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { addUserImg } from '../constant/element';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useApi } from '../context/api';

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
  const { user } = useUser();
  const { getInvites } = useApi();
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
        toast.error('Something went wrong!');
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
        }),
      });

      if (!response.ok) {
        toast.error('Something went wrong!');
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
      title: 'Reject',
      loading: isLoading.approve,
      action: () => {
        updateStatus('approve', 'rejected');
      },
    },
    reject: {
      title: 'Accept',
      loading: isLoading.reject,
      action: () => {
        updateStatus('reject', 'accepted');
      },
    },
  };

  return (
    <div class="modal fade" id="invite-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">I am a co-sampul for</h5>
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
                        We are delighted to inform you that you had been
                        selected as a {keyValue.level} {keyValue.type} for{' '}
                        {keyValue.from_nric_name}. We hope that you have been
                        briefed by {keyValue.from_nric_name} on the appointment
                        and are ready to take on the responsibilities.
                      </p>
                      <p />
                      Briefly, your responsibilities as a Co-Sampul is to be
                      given the information of {keyValue.from_nric_name}’s
                      wasiat/will which contain all assets’ information and
                      wishes at the point of death and assist the loved ones in
                      managing the estate in the event of death. Click{' '}
                      <Link href="/">HERE</Link> for the process flow.
                      <p />
                    </div>
                    <div class="text-sm-regular-6">
                      Current Status: <b>{currentStatus(selectedItem)}</b>
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
                  class="btn btn-primary btn-lg btn-text"
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
                  class="btn btn-primary btn-lg btn-text"
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
