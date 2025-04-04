import { addUserImg } from '../constant/element';
import {
  instructionsAfterDeath,
  servicePlatformAccountTypes,
  servicePlatformFrequencies,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { deleteImage, getOptionLabelWithIcon } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useId } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';

const digitalAssetsTypeName = {
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

const DigitalAssetsModalV1 = ({ keyType, selectedItem }) => {
  const { contextApiData, getDigitalAssets } = useApi();
  const { locale } = useLocale();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
  });

  const [createMore, setCreateMore] = useState({
    status: false,
    animated: false,
  });

  const [newServicePlatform, setNewServicePlatform] = useState(false);
  const [arrayElements, setArrayElements] = useState({
    bodies: null,
  });

  const setFrequencyBasedOnType = (type) => {
    const frequencySelect = document.getElementById(
      'select-digital-assets-frequency'
    );
    if (type === 'non_subscription') {
      const NA_frequency = servicePlatformFrequencies().find(
        (item) => item.value === 'n_a'
      );
      if (NA_frequency) {
        frequencySelect.value = NA_frequency.value;
        frequencySelect.disabled = true;
      } else {
        frequencySelect.disabled = false;
      }
    } else {
      frequencySelect.disabled = false;
    }
  };

  const elementList = () => {
    const inputElements = {
      digital_assets_modal: {
        elements: {
          // username: document.getElementById('input-digital-assets-username'),
          email: document.getElementById('input-digital-assets-email'),
          // bodies_id: document.getElementById(
          //   'select-digital-assets-service-platform'
          // ),
          new_service_platform_name: document.getElementById(
            'input-digital-assets-new-service-platform-name'
          ),
          new_service_platform_url: document.getElementById(
            'input-digital-assets-new-service-platform-url'
          ),
          account_type: document.getElementById('select-digital-assets-type'),
          frequency: document.getElementById('select-digital-assets-frequency'),
          declared_value_myr: document.getElementById(
            'input-digital-assets-declared-value'
          ),
          instructions_after_death: document.getElementById(
            'select-digital-assets-instructions-after-death'
          ),
          beloved_id: document.getElementById('select-digital-assets-beloved'),
          remarks: document.getElementById('input-digital-assets-remarks'),
        },
      },
    };

    return inputElements;
  };

  useEffect(() => {
    const editedType = document.getElementById('select-digital-assets-type');
    setFrequencyBasedOnType(editedType.value);

    setNewServicePlatform(false);

    var element = elementList().digital_assets_modal.elements;

    for (const key in element) {
      if (key == 'image_path') {
        element[key].src = addUserImg;
      } else {
        element[key].value = '';
      }
    }

    if (selectedItem) {
      if (selectedItem?.new_service_platform_name) {
        setNewServicePlatform(true);
      } else {
        setNewServicePlatform(false);
        if (contextApiData.bodies.data.length > 0) {
          var foundObject = contextApiData.bodies.data.find(
            (obj) => obj.id === selectedItem.bodies_id
          );

          setArrayElements((prevState) => ({
            ...prevState,
            bodies: {
              ...foundObject,
              label: foundObject.name,
              value: foundObject.id,
            },
          }));
        }
      }

      for (const key in element) {
        element[key].value = selectedItem[key];

        if (key == 'image_path') {
          const imageUrl = selectedItem[key]
            ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${selectedItem[key]}`
            : addUserImg;
          element.image_path.src = imageUrl;
        }
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (contextApiData.profile.data?.email && selectedItem == null) {
      elementList().digital_assets_modal.elements.email.value =
        contextApiData.profile.data?.email;
    }
  }, [contextApiData.profile.data?.email, selectedItem]);

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setFrequencyBasedOnType(selectedType);
  };

  const addDigitalAssets = async () => {
    var element = elementList().digital_assets_modal.elements;

    const addData = {};

    if (arrayElements.bodies) {
      addData.bodies_id = arrayElements.bodies.value;
    }

    for (const key in element) {
      if (key !== 'image_path') {
        addData[key] = element[key].value;
      }
    }

    if (newServicePlatform) {
      addData.bodies_id = null;
    }

    if (!newServicePlatform) {
      addData.new_service_platform_name = null;
      addData.new_service_platform_url = null;
    }

    const { data: returnData, error } = await supabase
      .from('digital_assets')
      .insert({
        uuid: contextApiData.user.data?.id,
        ...addData,
      })
      .select();

    if (error) {
      toast.error(error.message);
      setIsLoading({
        ...isLoading,
        update: false,
      });
      return;
    }

    toast.success(translations[locale].global.successfully_submitted);

    if (createMore.status == true) {
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
      $('#digital-assets-modal')?.modal('hide');
    }

    setIsLoading({
      ...isLoading,
      update: false,
    });

    var element = elementList().digital_assets_modal.elements;

    for (const key in element) {
      if (key == 'image_path') {
        element[key].src = addUserImg;
      } else if (key == 'email') {
        // not clear
      } else {
        element[key].value = '';
      }
    }

    getDigitalAssets();
  };

  const editDigitalAssets = async () => {
    var element = elementList().digital_assets_modal.elements;

    const addData = {};

    for (const key in element) {
      if (key !== 'image_path') {
        addData[key] = element[key].value;
      }
    }

    if (arrayElements.bodies) {
      addData.bodies_id = arrayElements.bodies.value;
    }

    if (newServicePlatform) {
      addData.bodies_id = null;
    }

    if (!newServicePlatform) {
      addData.new_service_platform_name = null;
      addData.new_service_platform_url = null;
    }

    const { data: returnData, error } = await supabase
      .from('digital_assets')
      .update({
        ...addData,
      })
      .eq('uuid', contextApiData.user.data?.id)
      .eq('id', selectedItem.id);

    if (error) {
      toast.error(error.message);
      setIsLoading({
        ...isLoading,
        update: false,
      });
      return;
    }

    $('#digital-assets-modal')?.modal('hide');
    toast.success(translations[locale].global.successfully_updated);

    setIsLoading({
      ...isLoading,
      update: false,
    });
    getDigitalAssets();
  };

  const deleteDigitalAssets = async () => {
    if (confirm(translations[locale].global.delete_confirmation)) {
      setIsLoading({
        ...isLoading,
        delete: true,
      });

      const { data, error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('uuid', contextApiData.user.data?.id)
        .eq('id', selectedItem.id);

      if (error) {
        toast.error(error.message);
        setIsLoading({
          ...isLoading,
          delete: false,
        });

        return;
      }
      await deleteImage({
        returnData: selectedItem,
      });

      $('#digital-assets-modal')?.modal('hide');
      toast.success(translations[locale].global.successfully_deleted);

      getDigitalAssets();

      setIsLoading({
        ...isLoading,
        delete: false,
      });
    }
  };

  const checkRestriction = async () => {
    var restricted = false;

    setIsLoading({
      ...isLoading,
      update: true,
    });

    const { data, count } = await supabase
      .from('digital_assets')
      .select('*', { count: 'exact', head: true })
      .eq('uuid', contextApiData.user.data?.id);

    if (
      contextApiData.account.data?.products?.access_control?.pages.digital.asset
        .limited
    ) {
      var max =
        contextApiData.account.data?.products.access_control.pages.digital.asset
          .maximum;
      if (count >= max) {
        toast.error(
          `${translations[locale].component.digital_assets_modal.you_can_store_} ${max} ${translations[locale].component.digital_assets_modal.digital_assets_to_}`
        );
        setIsLoading({
          ...isLoading,
          update: false,
        });
        restricted = true;
      }
    } else {
      restricted = false;
    }

    return restricted;
  };

  const onSubmitAddDigitalAssets = async (event) => {
    event.preventDefault();

    setIsLoading({
      ...isLoading,
      update: true,
    });

    if (keyType == 'add') {
      checkRestriction().then(async (restricted) => {
        if (restricted == false) {
          await addDigitalAssets();
        } else {
          setIsLoading({
            ...isLoading,
            update: false,
          });
        }
      });
    }
    if (keyType == 'edit') {
      await editDigitalAssets();
    }
  };

  const checkBeloved = () => {
    if (contextApiData.beloved.data?.length == 0) {
      return (
        <div
          class="alert text-center empty-beloved-card"
          role="alert"
          onClick={async () => {
            $('#digital-assets-modal')?.modal('hide');
            setTimeout(() => {
              router.push('beloved');
            }, 1000);
          }}
        >
          {
            translations[locale].component.digital_assets_modal
              .appoint_my_trusted_
          }{' '}
          <i class="bi bi-arrow-right-short"></i>
        </div>
      );
    }
  };

  return (
    <div class="modal fade" id="digital-assets-modal">
      <div
        class={`modal-dialog modal-dialog-centered ${
          createMore.animated ? 'pulse-modal' : ''
        }`}
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {
                translations[locale].component.digital_assets_modal
                  .digital_assets_expenses
              }
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
                        d="M6 21H9M15 21H18M17.5 6.5V14.5M3 6.2L3 14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18L17.8 18C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.7157 20.2843 3.40974 19.908 3.21799C19.4802 3 18.9201 3 17.8 3L6.2 3C5.0799 3 4.51984 3 4.09202 3.21799C3.7157 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2ZM11.5 10.5C11.5 11.8807 10.3807 13 9 13C7.61929 13 6.5 11.8807 6.5 10.5C6.5 9.11929 7.61929 8 9 8C10.3807 8 11.5 9.11929 11.5 10.5Z"
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
                    {
                      translations[locale].component.digital_assets_modal
                        .account_details
                    }
                  </div>
                  <div class="text-sm-regular-6">
                    {
                      translations[locale].component.digital_assets_modal
                        .help_us_to_
                    }
                  </div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>
            <form onSubmit={onSubmitAddDigitalAssets}>
              {/* <div class="form-field-wrapper">
                  <label
                    htmlFor={`input-digital-assets-username`}
                    class="uui-field-label"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-digital-assets-username`}
                    required
                  />
                </div> */}
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`input-digital-assets-email`}
                  class="uui-field-label"
                >
                  {translations[locale].component.digital_assets_modal.email}
                </label>
                <input
                  type="email"
                  class="form-control"
                  id={`input-digital-assets-email`}
                  required
                />
              </div>
              <div
                class="form-field-wrapper"
                style={{
                  transition: 'max-height 0.5s ease', // Use max-height for animation
                  overflow: newServicePlatform ? 'hidden' : '',
                  maxHeight: newServicePlatform ? '0px' : '200px',
                }}
              >
                <label class="uui-field-label">
                  {
                    translations[locale].component.digital_assets_modal
                      .platform_account
                  }{' '}
                  <Loading loading={contextApiData.bodies.isLoading} />
                </label>
                <Select
                  instanceId={useId()}
                  value={arrayElements.bodies}
                  options={contextApiData.bodies.data
                    ?.filter(
                      (item) =>
                        item.category !== 'sadaqah_waqaf_zakat' &&
                        item.category !== 'waqaf'
                    )
                    .map((item) => ({
                      ...item,
                      label: item.name,
                      value: item.id,
                    }))}
                  onChange={(newValues) => {
                    setArrayElements((prevState) => ({
                      ...prevState,
                      bodies: newValues,
                    }));
                  }}
                  getOptionLabel={getOptionLabelWithIcon}
                  getOptionValue={(option) => option.label}
                  required={!newServicePlatform ? true : false}
                />
              </div>
              {!newServicePlatform ? (
                <div class="mb-3">
                  <small>
                    {
                      translations[locale].component.digital_assets_modal
                        .Cannot_find_your_
                    }{' '}
                    <b
                      class="text-primary pointer-on-hover"
                      onClick={() => {
                        setNewServicePlatform(!newServicePlatform);
                      }}
                    >
                      {
                        translations[locale].component.digital_assets_modal
                          .add_a_new_
                      }
                    </b>
                  </small>
                </div>
              ) : (
                <></>
              )}
              <div
                style={{
                  transition: 'max-height 0.5s ease', // Use max-height for animation
                  overflow: 'hidden',
                  maxHeight: newServicePlatform ? '300px' : '0px',
                }}
              >
                <div class="row mx-0 mb-3">
                  <div class="col px-0">
                    <label>
                      {
                        translations[locale].component.digital_assets_modal
                          .new_platform_account
                      }
                    </label>
                  </div>
                  <div class="col px-0 text-end">
                    <small>
                      <b
                        class="text-primary pointer-on-hover"
                        onClick={() => {
                          setNewServicePlatform(!newServicePlatform);
                        }}
                      >
                        <i class="bi bi-x-circle"></i>
                      </b>
                    </small>
                  </div>
                </div>
                <div class="form-content-2 mb-3">
                  <div class="form-field-wrapper">
                    <label
                      htmlFor={`input-digital-assets-new-service-platform-name`}
                      class="uui-field-label"
                    >
                      {
                        translations[locale].component.digital_assets_modal
                          .service_provider
                      }
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id={`input-digital-assets-new-service-platform-name`}
                      required={newServicePlatform ? true : false}
                    />
                  </div>
                  <div class="form-field-wrapper">
                    <label
                      htmlFor={`input-digital-assets-new-service-platform-url`}
                      class="uui-field-label"
                    >
                      {
                        translations[locale].component.digital_assets_modal
                          .website_url
                      }
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id={`input-digital-assets-new-service-platform-url`}
                      required={newServicePlatform ? true : false}
                    />
                  </div>
                </div>
                <div class="border-bottom mb-3"></div>
              </div>
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-type`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .is_this_a_
                  }
                </label>
                <select
                  id={`select-digital-assets-type`}
                  required
                  class="form-select"
                  onChange={handleTypeChange}
                >
                  {servicePlatformAccountTypes().map((item) => (
                    <option key={item.value} value={item.value}>
                      {translations[locale]?.global[item.translationKey]}
                    </option>
                  ))}
                </select>
              </div>
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-frequency`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .how_often_do_
                  }
                </label>
                <select
                  id={`select-digital-assets-frequency`}
                  required
                  class="form-select"
                >
                  {servicePlatformFrequencies().map((item) => (
                    <option key={item.value} value={item.value}>
                      {translations[locale]?.global[item.value]}
                    </option>
                  ))}
                </select>
              </div>
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`input-digital-assets-declared-value`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .what_estimate_value_
                  }
                </label>
                <div class="input-group">
                  <div class="input-group-text">RM</div>
                  <input
                    type="number"
                    step="0.01"
                    class="form-control"
                    id={`input-digital-assets-declared-value`}
                    required
                  />
                </div>
              </div>
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-instructions-after-death`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .what_should_we_
                  }
                </label>
                <select
                  id={`select-digital-assets-instructions-after-death`}
                  required
                  class="form-select"
                >
                  {instructionsAfterDeath(
                    contextApiData?.profile?.data?.religion
                  ).map((item) => (
                    <option key={item.value} value={item.value}>
                      {translations[locale]?.global[item.translationKey]}
                    </option>
                  ))}
                </select>
              </div>

              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-beloved`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .who_will_manage_
                  }{' '}
                  <Loading loading={contextApiData.beloved.isLoading} />
                </label>
                <select
                  id={`select-digital-assets-beloved`}
                  required
                  class="form-select"
                >
                  {contextApiData.beloved.data
                    ?.filter((item) => item.type === 'future_owner')
                    .map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
                {checkBeloved()}
              </div>

              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`input-digital-assets-remarks`}
                  class="uui-field-label"
                >
                  {
                    translations[locale].component.digital_assets_modal
                      .anything_else_we_
                  }
                </label>
                <textarea
                  class="form-control"
                  id={`input-digital-assets-remarks`}
                  placeholder={
                    translations[locale].component.digital_assets_modal
                      .please_download_all
                  }
                />
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="checkbox-digital-assets"
                    required
                  />
                  <label class="form-check-label" htmlFor="flexCheckChecked">
                    {
                      translations[locale].component.digital_assets_modal
                        .you_agree_to_
                    }{' '}
                    <Link href="policy" target="_blank">
                      {
                        translations[locale].component.digital_assets_modal
                          .privacy_policy_
                      }
                    </Link>
                  </label>
                </div>
              </div>

              <div class="mt-5">
                {digitalAssetsTypeName[keyType].show_create_more ? (
                  <div className="form-field-wrapper mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="checkbox-digital-assets-create-more"
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
                        htmlFor="checkbox-digital-assets-create-more"
                      >
                        {
                          translations[locale].component.digital_assets_modal
                            .create_more
                        }
                      </label>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-text">
                    <Loading
                      title={digitalAssetsTypeName[keyType].button_title}
                      loading={isLoading.update}
                    />
                  </button>
                  {digitalAssetsTypeName[keyType].allow_delete ? (
                    <button
                      type="button"
                      class="btn btn-light btn-text"
                      onClick={deleteDigitalAssets}
                    >
                      <Loading
                        title={translations[locale].global.delete}
                        loading={isLoading.delete}
                      />
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssetsModalV1;

// The summary of this page includes:
// This page described is designed to ensure these assets are handled appropriately after the user's death.
// It allows users to add or edit details of their digital accounts, such as email, platform details, subscription type, payment frequency, estimated value, and instructions for after death.
// Users can also nominate trusted individuals to manage these accounts.
// The form includes options to add new platform details and supports creating multiple entries if needed.
