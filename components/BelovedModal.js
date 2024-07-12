import { addUserImg } from '../constant/element';
import { belovedLevel, beneficiaryTypes, countries } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

const getElements = () => {
  // Note: if you make changes into beloved_modal elements, do apply same changes into the beloved.js page.
  // Note: align also with clearForms() function
  const inputElements = {
    beloved_modal: {
      name: document.getElementById('input-beloved-name'),
      // nric_no: document.getElementById('input-beloved-nric-no'),
      phone_no: document.getElementById('input-beloved-phone-no'),
      address_1: document.getElementById('input-beloved-address-1'),
      address_2: document.getElementById('input-beloved-address-2'),
      city: document.getElementById('input-beloved-city'),
      postcode: document.getElementById('input-beloved-postcode'),
      state: document.getElementById('input-beloved-state'),
      country: document.getElementById('select-beloved-country'),
      email: document.getElementById('input-beloved-email'),
      // relationship: document.getElementById('select-beloved-relationship'),
      type: document.getElementById('select-beloved-type'),
      level: document.getElementById('select-beloved-level'),
      image_path: document.getElementById('preview-beloved-image'),
    },
  };

  return inputElements;
};

const BelovedModal = ({ keyType, belovedType, selectedItem }) => {
  const { contextApiData, getBeloved, getDigitalAssets } = useApi();
  const { locale } = useLocale();

  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
  });

  const [createMore, setCreateMore] = useState({
    status: false,
    animated: false,
  });

  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addUserImg,
  });

  const resendEmail = async () => {
    const returnBeloved = selectedItem;
    const returnInvite = selectedItem.beloved_invites[0];

    if (belovedConfig[belovedType].verifyEmail) {
      if (returnBeloved?.email) {
        await sendInviteBeloveEmail({
          to_email: returnBeloved.email,
          to_name: returnBeloved.name,
          to_type: beneficiaryTypes().find(
            (obj) => obj.value === returnBeloved.type
          ).name,
          to_level: belovedLevel().find(
            (obj) => obj.value === returnBeloved.level
          ).name,
          from_name: contextApiData.profile.data?.nric_name,
          invite_uuid: returnInvite.invite_uuid,
          beloved_id: returnBeloved.id,
        });

        $('#beloved-modal')?.modal('hide');
        setTimeout(() => {
          clearForms();
          getBeloved();
        }, 3000);
      }
    }
  };

  const checkEmailStatus = () => {
    const resendEmailEventTypes = {
      'email.sent': {
        title: 'Email successfully sent',
        description:
          'The API request was successful and Resend will attempt to deliver the message to the recipient’s mail server.',

        view: (
          <span style={{ color: 'red' }}>
            {translations[locale].component.beloved_modal.email_not_delivered}{' '}
            <span
              class="text-primary pointer-on-hover"
              onClick={() => {
                var element = getElements().beloved_modal;

                if (
                  element.email.value ===
                  selectedItem?.beloved_invites[0]?.email
                ) {
                  resendEmail();
                } else {
                  toast.error(
                    `To update the current record, please click the 'update' button.`
                  );
                }
              }}
            >
              {translations[locale].component.beloved_modal.click_to_resend}
            </span>
          </span>
        ),
      },
      'email.delivered': {
        title: 'Email successfully delivered',
        description:
          'Resend successfully delivered the email to the recipient’s mail server.',

        view: (
          <span style={{ color: 'green' }}>
            {
              translations[locale].component.beloved_modal
                .email_successfully_delivered
            }
          </span>
        ),
      },
      // 'email.delivered_delayed': {
      //   title: 'Delayed',
      //   description:
      //     'The email couldn’t be delivered to the recipient’s mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient’s inbox is full, or when the receiving email server experiences a transient issue.',
      // },
      // 'email.complained': {
      //   title: 'Marked as spam',
      //   description:
      //     'The email was successfully delivered to the recipient’s mail server, but the recipient marked it as spam.',
      // },
      'email.bounced': {
        title: 'Failed to send email',
        description:
          'The recipient’s mail server permanently rejected the email.',
        view: (
          <span style={{ color: 'red' }}>
            {translations[locale].component.beloved_modal.failed_to_send_}{' '}
            <span
              class="text-primary pointer-on-hover"
              onClick={() => {
                var element = getElements().beloved_modal;

                if (
                  element.email.value ===
                  selectedItem?.beloved_invites[0]?.email
                ) {
                  resendEmail();
                } else {
                  toast.error(
                    translations[locale].component.beloved_modal.to_update_the_
                  );
                }
              }}
            >
              {translations[locale].component.beloved_modal.click_to_resend}
            </span>
          </span>
        ),
      },
      // 'email.opened': {
      //   title: 'Email Opened',
      //   description: 'The recipient’s opened the email.',
      // },
      // 'email.clicked': {
      //   title: 'Email Clicked',
      //   description: 'The recipient’s clicked on an email link.',
      // },
    };

    var email_status_invites = '';
    if (selectedItem?.beloved_invites?.length !== 0) {
      if (selectedItem?.beloved_invites[0]?.email_status) {
        email_status_invites =
          resendEmailEventTypes[selectedItem.beloved_invites[0]?.email_status]
            ?.view || '';
      } else {
        email_status_invites = '';
      }
    }

    return email_status_invites;
  };

  const belovedConfig = {
    co_sampul: {
      title:
        translations[locale].component.beloved_modal.appoint_your_co_sampul,
      subtitle: translations[locale].component.beloved_modal.co_sampul_is_your_,
      display_level: '',
      display_phone_number: 'none',
      phone_number_required: false,
      display_address: 'none',
      level_required: true,
      email_required: true,
      beloved_list: belovedLevel().filter(
        (option) => option.value !== 'others'
      ),
      verifyEmail: true,
      max_create_more: 2,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'co_sampul'
      ),
      email_status: checkEmailStatus(),
      level_info_tooltip_content: `<div>
      <p>${translations[locale].component.beloved_modal.when_you_create_}</p>
      <p>${translations[locale].component.beloved_modal.secondary_co_sampul_will}</p></div>`,
    },
    future_owner: {
      title:
        translations[locale].component.beloved_modal.appoint_your_beneficiary,
      subtitle: translations[locale].component.beloved_modal.the_future_owner_,
      display_level: 'none',
      display_phone_number: '',
      phone_number_required: true,
      display_address: '',
      level_required: false,
      email_required: false,
      beloved_list: belovedLevel(),
      verifyEmail: false,
      max_create_more: 1000,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'future_owner'
      ),
    },
    guardian: {
      title: translations[locale].component.beloved_modal.appoint_your_guardian,
      subtitle: translations[locale].component.beloved_modal.the_caretaker_of,

      display_level: '',
      display_phone_number: '',
      phone_number_required: true,
      display_address: '',
      level_required: true,
      email_required: false,
      beloved_list: belovedLevel().filter(
        (option) => option.value !== 'others'
      ),
      verifyEmail: false,
      max_create_more: 2,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'guardian'
      ),
      level_info_tooltip_content:
        translations[locale].component.beloved_modal.when_you_create_guardian_,
    },
  };

  const belovedTypeName = {
    add: {
      key: 'add',
      button_title: translations[locale].component.beloved_modal.submit,
      allow_delete: false,
      show_create_more: true,
    },
    edit: {
      key: 'edit',
      button_title: translations[locale].component.beloved_modal.update,
      allow_delete: true,
      show_create_more: false,
    },
  };

  const clearForms = () => {
    var element = getElements().beloved_modal;

    try {
      element.name.value = '';
      element.phone_no.value = '';
      element.address_1.value = '';
      element.address_2.value = '';
      element.city.value = '';
      element.postcode.value = '';
      element.state.value = '';
      element.country.value = '';
      element.email.value = '';

      element.image_path.value = '';
      setSelectedImage({
        data: null,
        url: addUserImg,
      });
      document.getElementById('input-beloved-image').value = '';
    } catch {
      console.log('Unable to clear forms');
    }
  };

  const addBeloved = async () => {
    if (contextApiData.profile.data?.nric_name) {
      if (belovedType !== 'co_sampul' && belovedType !== 'guardian') {
        document.getElementById('select-beloved-level').value = 'others';
      }

      document.getElementById('select-beloved-type').value = belovedType;

      const addData = {};

      for (const key in getElements().beloved_modal) {
        if (key !== 'image_path') {
          addData[key] = getElements().beloved_modal[key].value;
        }
      }

      if (addData?.country == '') {
        addData.country = null;
      }

      const { data: returnBeloved, error: errorBeloved } = await supabase
        .from('beloved')
        .insert({
          uuid: contextApiData.user.data?.id,
          ...addData,
        })
        .select()
        .single();

      if (errorBeloved) {
        toast.error(errorBeloved.message);
        return;
      }

      const directory = `/beloved/${returnBeloved.id}/avatar/`;
      const imageInput = document.getElementById('input-beloved-image');

      await replaceOrAddImage({
        userId: contextApiData.user.data?.id,
        returnData: returnBeloved,
        directory,
        imageInput,
        dataBase: 'beloved',
        isUpdateByReturnId: true,
      });

      const { data: returnInvite, error: errorInvite } = await supabase
        .from('beloved_invites')
        .insert({
          beloved_id: returnBeloved.id,
          uuid: returnBeloved.uuid,
          email: returnBeloved.email,
          invite_uuid: uuidv4(),
        })
        .select()
        .single();

      if (errorInvite) {
        toast.error(errorInvite.message);
        return;
      }

      toast.success(
        translations[locale].component.beloved_modal.successfully_submitted
      );

      if (
        createMore.status == true &&
        belovedConfig[belovedType].current_user?.length + 1 !==
          belovedConfig[belovedType].max_create_more
      ) {
        setCreateMore((prev) => ({
          ...prev,
          animated: true,
        }));
        setTimeout(() => {
          setCreateMore((prev) => ({
            ...prev,
            animated: false,
          }));
        }, 1000);
      } else {
        $('#beloved-modal')?.modal('hide');
      }

      setSelectedImage({
        data: null,
        url: addUserImg,
      });

      if (belovedConfig[belovedType].verifyEmail) {
        if (returnBeloved?.email) {
          await sendInviteBeloveEmail({
            to_email: returnBeloved.email,
            to_name: returnBeloved.name,
            to_type: beneficiaryTypes().find(
              (obj) => obj.value === returnBeloved.type
            ).name,
            to_level: belovedLevel().find(
              (obj) => obj.value === returnBeloved.level
            ).name,
            from_name: contextApiData.profile.data?.nric_name,
            invite_uuid: returnInvite.invite_uuid,
            beloved_id: returnBeloved.id,
          });
        }
      }

      setTimeout(() => {
        clearForms();
        getBeloved();
      }, 3000);
    } else {
      toast.error(
        translations[locale].component.beloved_modal.please_update_your_
      );
    }
  };

  const sendInviteBeloveEmail = async (passData) => {
    try {
      const response = await fetch('/api/beloved/email-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...passData,
        }),
      });

      if (!response.ok) {
        toast.error(
          translations[locale].component.beloved_modal.failed_to_send_
        );
        throw new Error(
          translations[locale].component.beloved_modal.failed_to_send_
        );
      }

      toast.success(
        `${translations[locale].component.beloved_modal.confirmation_email_has_} ${passData.to_email}`,
        {
          duration: 6000,
        }
      );

      const data = await response.json();

      const { error } = await supabase
        .from('beloved_invites')
        .update({
          invite_status: 'pending',
          email_resend_id: data?.id ? data.id : null,
          invited_uuid: null,
        })
        .eq('invite_uuid', passData.invite_uuid);

      if (error) {
        toast.error(error.message);
        return;
      }

      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const editBeloved = async () => {
    const addData = {};

    for (const key in getElements().beloved_modal) {
      if (key !== 'image_path') {
        addData[key] = getElements().beloved_modal[key].value;
      }
    }

    if (addData?.country == '') {
      addData.country = null;
    }

    const { data: returnData, error } = await supabase
      .from('beloved')
      .update({
        ...addData,
      })
      .eq('uuid', contextApiData.user.data?.id)
      .eq('id', selectedItem.id)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    const directory = `/beloved/${returnData.id}/avatar/`;
    const imageInput = document.getElementById('input-beloved-image');

    await replaceOrAddImage({
      userId: contextApiData.user.data?.id,
      returnData,
      directory,
      imageInput,
      dataBase: 'beloved',
      isUpdateByReturnId: true,
    });

    if (belovedConfig[belovedType].verifyEmail) {
      var element = getElements().beloved_modal;

      if (element.email.value !== selectedItem?.beloved_invites[0]?.email) {
        const { data: returnInvite, error: errorInvite } = await supabase
          .from('beloved_invites')
          .update({
            email: returnData.email,
          })
          .eq('id', selectedItem?.beloved_invites[0]?.id)
          .select()
          .single();

        var returnBeloved = returnData;

        if (returnBeloved?.email) {
          await sendInviteBeloveEmail({
            to_email: returnBeloved.email,
            to_name: returnBeloved.name,
            to_type: beneficiaryTypes().find(
              (obj) => obj.value === returnBeloved.type
            ).name,
            to_level: belovedLevel().find(
              (obj) => obj.value === returnBeloved.level
            ).name,
            from_name: contextApiData.profile.data?.nric_name,
            invite_uuid: returnInvite.invite_uuid,
            beloved_id: returnBeloved.id,
          });
        }
      }
    }

    $('#beloved-modal')?.modal('hide');
    toast.success(
      translations[locale].component.beloved_modal.successfully_updated
    );

    setTimeout(() => {
      getBeloved();
    }, 3000);

    setSelectedImage({
      data: null,
      url: addUserImg,
    });
  };

  const deleteBeloved = async () => {
    if (
      confirm(
        translations[locale].component.beloved_modal.confirm_deletion_this_
      )
    ) {
      setIsLoading({
        ...isLoading,
        delete: true,
      });

      const { data: returnData, error } = await supabase
        .from('beloved')
        .delete()
        .eq('uuid', contextApiData.user.data?.id)
        .eq('id', selectedItem.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23503') {
          toast.error(
            translations[locale].component.beloved_modal.the_user_cannot_,
            {
              duration: 6000,
            }
          );
        } else {
          toast.error(error.message);
        }

        setIsLoading({
          ...isLoading,
          delete: false,
        });

        return;
      }

      await deleteImage({
        returnData: returnData,
      });

      $('#beloved-modal')?.modal('hide');
      toast.success(
        translations[locale].component.beloved_modal.successfully_deleted
      );

      getBeloved();
      getDigitalAssets();

      setIsLoading({
        ...isLoading,
        delete: false,
      });
    }
  };

  const onSubmitAddBeloved = async (event) => {
    event.preventDefault();

    const inputEmail = document.getElementById('input-beloved-email');

    if (inputEmail.value !== contextApiData.profile.data?.email) {
      setIsLoading({
        ...isLoading,
        update: true,
      });

      if (keyType == 'add') {
        await addBeloved();
      }
      if (keyType == 'edit') {
        await editBeloved();
      }

      setIsLoading({
        ...isLoading,
        update: false,
      });
    } else {
      toast.error(
        translations[locale].component.beloved_modal.please_enter_an_
      );
    }
  };

  return (
    <div class="modal fade" id="beloved-modal">
      <div
        class={`modal-dialog modal-dialog-centered ${
          createMore.animated ? 'pulse-modal' : ''
        }`}
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {translations[locale].component.beloved_modal.beloved}
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
                <div class="text-and-supporting-text-18">
                  <div class="text-lg-semibold-4">
                    {belovedConfig[belovedType].title}
                  </div>
                  <div class="text-sm-regular-6">
                    {belovedConfig[belovedType].subtitle}
                  </div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>
            <form onSubmit={onSubmitAddBeloved}>
              <div class="form-field-wrapper mb-3">
                <label htmlFor={`input-beloved-name`} class="uui-field-label">
                  {translations[locale].component.beloved_modal.name_nickname}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id={`input-beloved-name`}
                  placeholder="e.g. Along, Angah, Acik"
                  required
                />
              </div>
              {/* <div class="form-field-wrapper">
                  <label
                    htmlFor={`input-beloved-nric-no`}
                    class="uui-field-label"
                  >
                    NRIC
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-beloved-nric-no`}
                    required
                  />
                </div>
                 */}
              <div class="form-field-wrapper mb-3">
                <label htmlFor={`input-beloved-email`} class="uui-field-label">
                  {translations[locale].component.beloved_modal.email}
                </label>
                <input
                  type="email"
                  class="form-control"
                  id={`input-beloved-email`}
                  required={belovedConfig[belovedType].email_required}
                />
                <small>{belovedConfig[belovedType].email_status}</small>
              </div>
              <div
                class="form-field-wrapper mb-3"
                style={{
                  display: belovedConfig[belovedType].display_phone_number,
                }}
              >
                <label
                  htmlFor={`input-beloved-phone-no`}
                  class="uui-field-label"
                >
                  {translations[locale].component.beloved_modal.phone_number}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id={`input-beloved-phone-no`}
                  required={belovedConfig[belovedType].phone_number_required}
                />
              </div>
              <div
                class="form-field-wrapper mb-3"
                style={{
                  display: belovedConfig[belovedType].display_address,
                }}
              >
                <label
                  htmlFor="input-beloved-address-1"
                  class="uui-field-label"
                >
                  {translations[locale].component.beloved_modal.address}
                </label>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    id="input-beloved-address-1"
                    placeholder={
                      translations[locale].component.beloved_modal.address_1
                    }
                  />
                  <input
                    type="text"
                    class="form-control mt-2"
                    id="input-beloved-address-2"
                    placeholder={
                      translations[locale].component.beloved_modal.address_2
                    }
                  />
                  <div class="form-content-2">
                    <div class="form-field-wrapper">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-city"
                        placeholder={
                          translations[locale].component.beloved_modal.city
                        }
                      />
                    </div>
                    <div class="form-field-wrapper mr-2">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-postcode"
                        placeholder={
                          translations[locale].component.beloved_modal.postcode
                        }
                      />
                    </div>
                  </div>
                  <div class="form-content-2 mb-3">
                    <div class="form-field-wrapper">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-state"
                        placeholder={
                          translations[locale].component.beloved_modal.state
                        }
                      />
                    </div>
                    <div class="form-field-wrapper">
                      <select
                        id="select-beloved-country"
                        class="form-select mt-2"
                      >
                        {countries().map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <div
                  class="form-field-wrapper"
                  style={{ display: belovedConfig[belovedType].display_level }}
                >
                  <label
                    htmlFor={`select-beloved-level`}
                    class="uui-field-label"
                  >
                    <span
                      data-tooltip-id="my-tooltip-level"
                      data-tooltip-html={
                        belovedConfig[belovedType]?.level_info_tooltip_content
                      }
                    >
                      {translations[locale].component.beloved_modal.level}{' '}
                      {belovedConfig[belovedType]
                        ?.level_info_tooltip_content ? (
                        <i class="bi bi-info-circle"></i>
                      ) : (
                        ''
                      )}
                    </span>
                    <Tooltip
                      id="my-tooltip-level"
                      place="bottom"
                      style={{
                        textAlign: 'justify',
                        maxWidth: '300px',
                        backgroundColor: 'black',
                        color: 'white',
                        'border-radius': '10px',
                        'z-index': '10',
                      }}
                    />
                  </label>
                  <select
                    id={`select-beloved-level`}
                    required={belovedConfig[belovedType].level_required}
                    class="form-select"
                  >
                    {belovedConfig[belovedType].beloved_list.map((item) => (
                      <option key={item.value} value={item.value}>
                        {translations[locale]?.global[item.value]}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div class="form-field-wrapper">
                  <label
                    htmlFor={`select-beloved-relationship`}
                    class="uui-field-label"
                  >
                    Relationship
                  </label>
                  <select
                    id={`select-beloved-relationship`}
                    required
                    class="form-select"
                  >
                    {relationships().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper" style={{ display: 'none' }}>
                  <label
                    htmlFor={`select-beloved-type`}
                    class="uui-field-label"
                  >
                    {
                      translations[locale].component.beloved_modal
                        .beneficiary_type
                    }
                  </label>
                  <select
                    id={`select-beloved-type`}
                    required
                    class="form-select"
                  >
                    {beneficiaryTypes().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="w-layout-grid settings_component">
                <div class="text-and-supporting-text-14">
                  <label class="uui-field-label">
                    {translations[locale].component.beloved_modal.profile_photo}
                  </label>
                  <div class="text-size-tiny">
                    {translations[locale].component.beloved_modal.this_will_be}
                  </div>
                </div>
                <div class="avatar-and-actions">
                  <img
                    loading="lazy"
                    src={selectedImage.url}
                    alt=""
                    class="avatar-7"
                    id="preview-beloved-image"
                    onClick={() => {
                      document.getElementById('input-beloved-image').click();
                    }}
                  />
                  <input
                    type="file"
                    id="input-beloved-image"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) => {
                      try {
                        let imageURL = URL.createObjectURL(
                          event.target.files[0]
                        );
                        if (imageURL) {
                          setSelectedImage({
                            data: event.target.files[0],
                            url: imageURL,
                          });
                        }
                      } catch {
                        console.log('Cancelled');
                      }
                    }}
                  />
                </div>
              </div>

              {/* <>
                <div class="mt-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox-beloved-0"
                      required
                    />
                    <label class="form-check-label" htmlFor="checkbox-beloved-0">
                      <small>
                        CO-SAMPUL IS A TRUSTED PERSON FOR WHICH MY WASIAT/WILL
                        WITH ALL THE ASSET INFORMATION AND WISHES WILL BE PASSED
                        ON UPON MY DEATH.
                      </small>
                    </label>
                  </div>
                </div>

                <div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox-beloved-1"
                      required
                    />
                    <label class="form-check-label" htmlFor="checkbox-beloved-1">
                      <small>
                        MY TRUSTED CO-SAMPUL WILL ONLY BE GIVEN ACCESS AFTER MY
                        DEATH TO ASSIST MY LOVED ONES IN MANAGING THE ESTATE. I
                        AM ALLOWED TO CHANGE MY CO-SAMPUL AT ANYTIME IF NEEDED.
                      </small>
                    </label>
                  </div>
                </div>

                <div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox-beloved-2"
                      required
                    />
                    <label class="form-check-label" htmlFor="checkbox-beloved-2">
                      <small>CO-SAMPUL MUST BE 18 YEARS OLD AND ABOVE</small>
                    </label>
                  </div>
                </div>

                <div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox-beloved-3"
                      required
                    />
                    <label class="form-check-label" htmlFor="checkbox-beloved-3">
                      <small>
                        I HAVE EXPLAIN ON SAMPUL AND SEEK CONSENT FROM MY
                        APPOINTED CO-SAMPUL TO SHARE HIS/HER PERSONAL
                        INFORMATION WITH SAMPUL. READ OUR{' '}
                        <Link href="policy" target="_blank">PRIVACY POLICY.</Link>
                      </small>
                    </label>
                  </div>
                </div>
              </> */}

              <div class="mt-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="checkbox-beloved"
                    required
                  />
                  <label class="form-check-label" htmlFor="flexCheckChecked">
                    {translations[locale].component.beloved_modal.you_agree_to}{' '}
                    <Link href="policy" target="_blank">
                      {
                        translations[locale].component.beloved_modal
                          .privacy_policy_
                      }
                    </Link>
                  </label>
                </div>
              </div>
              <div class="mt-5">
                {belovedTypeName[keyType].show_create_more &&
                belovedConfig[belovedType].current_user?.length + 1 !==
                  belovedConfig[belovedType].max_create_more ? (
                  <div className="form-field-wrapper mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="checkbox-beloved-create-more"
                        checked={createMore.status}
                        onChange={(e) =>
                          setCreateMore((prev) => ({
                            ...prev,
                            status: e.target.checked,
                          }))
                        }
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="checkbox-beloved-create-more"
                      >
                        {
                          translations[locale].component.beloved_modal
                            .create_more
                        }
                      </label>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={belovedTypeName[keyType].button_title}
                    loading={isLoading.update}
                  />
                </button>
                {belovedTypeName[keyType].allow_delete ? (
                  <button
                    type="button"
                    class="btn btn-light btn-text"
                    onClick={deleteBeloved}
                  >
                    <Loading
                      title={
                        translations[locale].component.beloved_modal.delete
                      }
                      loading={isLoading.delete}
                    />
                  </button>
                ) : (
                  ''
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BelovedModal;

// The summary of this page includes:
// This page describes a modal interface designed for managing personal information and preferences.
// It includes fields for entering details like name, email, phone number, and address.
// Users can also select a level from a dropdown menu, upload a profile photo, and agree to a privacy policy.
// The interface allows for creating multiple entries if enabled, and provides options for updating or deleting entries as needed.
