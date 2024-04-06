import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import { belovedLevel, beneficiaryTypes, countries } from '../constant/enum';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { addUserImg } from '../constant/element';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'react-tooltip';
import { useApi } from '../context/api';

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
  const { contextApiData, getBeloved } = useApi();

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

  const belovedConfig = {
    co_sampul: {
      title: 'Appoint your Co-Sampul',
      subtitle: `Co-Sampul is your trusted person for
      whom which all information in this
      Sampul will be passed on`,
      display_level: '',
      display_phone_number: 'none',
      phone_number_required: false,
      display_address: 'none',
      level_required: true,
      beloved_list: belovedLevel().filter(
        (option) => option.value !== 'others'
      ),
      verifyEmail: true,
      max_create_more: 2,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'co_sampul'
      ),
      level_info_tooltip_content: `<div>
      <p>When you create a will and appoint an Primary Co-Sampul, you should also appoint an alternate Co-Sampul ( Secondary Co-Sampul).</p>
      <p>Secondary Co-Sampul will take over the Primary Co-Sampul duties if your Primary Co-Sampul dies, is unable to act as Co-Sampul , or decides he or she does not wish to be the Co-Sampul. The appointed Primary Co-Sampul does not have to consult the Secondary Co-Sampul. Secondary Co-Sampul is only named in the will to fill in for the appointed Primary Co-Sampul if required.</p></div>`,
    },
    future_owner: {
      title: 'Appoint your Beneficiary',
      subtitle: 'The future owner of your assets',
      display_level: 'none',
      display_phone_number: '',
      phone_number_required: true,
      display_address: '',
      level_required: false,
      beloved_list: belovedLevel(),
      verifyEmail: false,
      max_create_more: 1000,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'future_owner'
      ),
    },
    guardian: {
      title: 'Appoint your Guardian',
      subtitle:
        'The caretaker of your underage kids ensuring they get the best care after you and you spoused demised',
      display_level: '',
      display_phone_number: '',
      phone_number_required: true,
      display_address: '',
      level_required: true,
      beloved_list: belovedLevel().filter(
        (option) => option.value !== 'others'
      ),
      verifyEmail: false,
      max_create_more: 2,
      current_user: contextApiData.beloved.data?.filter(
        (option) => option.type == 'guardian'
      ),
      level_info_tooltip_content:
        'When you create a will and appoint an Primary Guardian, you should also appoint an alternate Guardian. The alternate Guardian will take over the Primary Guardian duties if your Primary Guardian dies, is unable to act as guardian, or decides he or she does not wish to be the Co-Sampul',
    },
  };

  const belovedTypeName = {
    add: {
      key: 'add',
      button_title: 'Submit',
      allow_delete: false,
      show_create_more: true,
    },
    edit: {
      key: 'edit',
      button_title: 'Update',
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

      toast.success('Successfully submitted!');

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

      clearForms();
      getBeloved();
    } else {
      toast.error(
        'Please update your profile to start adding your loved ones, which can be done in the settings page.'
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
        toast.error('Failed to send invitation email');
        throw new Error('Failed to send invitation email');
      }

      toast.success(
        `Confirmation email has been sent to ${passData.to_email}`,
        {
          duration: 6000,
        }
      );

      const data = await response.json();

      const { error } = await supabase
        .from('beloved_invites')
        .update({
          invite_status: 'pending',
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

    $('#beloved-modal')?.modal('hide');
    toast.success('Successfully updated!');
    getBeloved();

    setSelectedImage({
      data: null,
      url: addUserImg,
    });
  };

  const deleteBeloved = async () => {
    if (
      confirm(
        `Are you sure you want to delete this record?, you'll also need to regenerate your will if the user linked to it.`
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
            `The user cannot be removed as they are associated with your digital assets / inform death record. Please assign the record to someone else and try to delete again.`,
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
      toast.success('Successfully deleted!');
      getBeloved();

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
      toast.error('Please enter an email address other than your own');
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
            <h5 class="modal-title">Beloved</h5>
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
                  Name/Nickname
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
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id={`input-beloved-email`}
                />
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
                  Phone number
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
                  Address
                </label>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    id="input-beloved-address-1"
                    placeholder="Address 1"
                  />
                  <input
                    type="text"
                    class="form-control mt-2"
                    id="input-beloved-address-2"
                    placeholder="Address 2"
                  />
                  <div class="form-content-2">
                    <div class="form-field-wrapper">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-city"
                        placeholder="City"
                      />
                    </div>
                    <div class="form-field-wrapper mr-2">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-postcode"
                        placeholder="Postcode"
                      />
                    </div>
                  </div>
                  <div class="form-content-2 mb-3">
                    <div class="form-field-wrapper">
                      <input
                        type="text"
                        class="form-control mt-2"
                        id="input-beloved-state"
                        placeholder="State"
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
                      Level{' '}
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
                        {item.name}
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
                    Beneficiary Type
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
                  <label class="uui-field-label">Profile photo</label>
                  <div class="text-size-tiny">
                    This will be displayed on profile.
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
                    You agree to our friendly{' '}
                    <Link href="policy" target="_blank">
                      privacy policy.
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
                        Create More
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
                    <Loading title="Delete" loading={isLoading.delete} />
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
