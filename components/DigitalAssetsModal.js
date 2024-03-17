import React, { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import Select, { createFilter } from 'react-select';
import {
  belovedLevel,
  beneficiaryTypes,
  instructionsAfterDeath,
  relationships,
  servicePlatformAccountTypes,
  servicePlatformFrequencies,
  servicePlatforms,
} from '../constant/enum';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { addUserImg } from '../constant/element';
import Link from 'next/link';

const digitalAssetsTypeName = {
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

const DigitalAssetsModal = ({
  keyType,
  selectedItem,
  refreshFunction,
  belovedList = {
    data: [],
    isReady: false,
  },
  bodyList = {
    data: [],
    isReady: false,
  },
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
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
          username: document.getElementById('input-digital-assets-username'),
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
        if (bodyList.data.length > 0) {
          var foundObject = bodyList.data.find(
            (obj) => obj.value === selectedItem.bodies_id
          );

          setArrayElements((prevState) => ({
            ...prevState,
            bodies: foundObject,
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
    if (user?.profile?.email && selectedItem == null) {
      elementList().digital_assets_modal.elements.email.value =
        user.profile.email;
    }
  }, [user?.profile?.email, selectedItem]);

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
        uuid: user?.uuid,
        ...addData,
      })
      .select();

    if (error) {
      toast.error(error.message);
      return;
    }

    $('#digital-assets-modal')?.modal('hide');
    toast.success('Successfully submitted!');
    if (refreshFunction) {
      refreshFunction();
    }
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
      .eq('uuid', user?.uuid)
      .eq('id', selectedItem.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    $('#digital-assets-modal')?.modal('hide');
    toast.success('Successfully updated!');
    if (refreshFunction) {
      refreshFunction();
    }
  };

  const deleteDigitalAssets = async () => {
    if (confirm(`Are you sure you want to delete this record?`)) {
      setIsLoading({
        ...isLoading,
        delete: true,
      });

      const { data, error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('uuid', user?.uuid)
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
      toast.success('Successfully deleted!');

      if (refreshFunction) {
        refreshFunction();
      }

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
      .eq('uuid', user?.uuid);

    if (user.access_control?.pages.digital.asset.limited) {
      var max = user.access_control.pages.digital.asset.maximum;
      if (count >= max) {
        toast.error(
          `You can store up to ${max} digital assets. To add more, upgrade your plan.`
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
        }
      });
    }
    if (keyType == 'edit') {
      await editDigitalAssets();
    }

    setIsLoading({
      ...isLoading,
      update: false,
    });
  };

  const checkBeloved = () => {
    if (belovedList.data.length == 0) {
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
          Appoint my trusted person <i class="bi bi-arrow-right-short"></i>
        </div>
      );
    }
  };

  const getOptionLabel = (item) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={
          item.details.icon
            ? `data:image/svg+xml,${encodeURIComponent(item.details.icon)}`
            : '/images/Displacement-p-500.png'
        }
        class="rounded-circle me-1"
        width={20}
        height={20}
      />
      <span class="text-truncate">{item.label}</span>
    </div>
  );

  return (
    <div class="modal fade" id="digital-assets-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Digital Assets</h5>
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
                  <div class="text-lg-semibold-4">Account Details</div>
                  <div class="text-sm-regular-6">
                    Ensure no assets will be left behind for your loved ones.
                  </div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>
            <form onSubmit={onSubmitAddDigitalAssets}>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
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
                </div>
                <div class="form-field-wrapper">
                  <label
                    htmlFor={`input-digital-assets-email`}
                    class="uui-field-label"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id={`input-digital-assets-email`}
                    required
                  />
                </div>
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
                  Service Platform <Loading loading={!bodyList.isReady} />
                </label>

                <Select
                  instanceId={useId()}
                  value={arrayElements.bodies}
                  options={bodyList.data}
                  onChange={(newValues) => {
                    setArrayElements((prevState) => ({
                      ...prevState,
                      bodies: newValues,
                    }));
                  }}
                  // getOptionLabel={getOptionLabel}
                  required={!newServicePlatform ? true : false}
                />

                {/* <select
                  id={`select-digital-assets-service-platform`}
                  class="form-select"
                  required={!newServicePlatform ? true : false}
                >
                  {bodyList.data.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>

              {!newServicePlatform ? (
                <div class="mb-3">
                  <small>
                    Can't find your Service platform?{' '}
                    <b
                      class="text-primary pointer-on-hover"
                      onClick={() => {
                        setNewServicePlatform(!newServicePlatform);
                      }}
                    >
                      Add a new one.
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
                    <label>New Service Platform</label>
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
                      Service Provider
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
                      Website URL
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
                  Type
                </label>
                <select
                  id={`select-digital-assets-type`}
                  required
                  class="form-select"
                  onChange={handleTypeChange}
                >
                  {servicePlatformAccountTypes().map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <label
                    htmlFor={`select-digital-assets-frequency`}
                    class="uui-field-label"
                  >
                    Frequency
                  </label>
                  <select
                    id={`select-digital-assets-frequency`}
                    required
                    class="form-select"
                  >
                    {servicePlatformFrequencies().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="form-field-wrapper">
                  <label
                    htmlFor={`input-digital-assets-declared-value`}
                    class="uui-field-label"
                  >
                    Declared Value
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
              </div>
              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-instructions-after-death`}
                  class="uui-field-label"
                >
                  Instructions After Death
                </label>
                <select
                  id={`select-digital-assets-instructions-after-death`}
                  required
                  class="form-select"
                >
                  {instructionsAfterDeath().map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div class="form-field-wrapper mb-3">
                <label
                  htmlFor={`select-digital-assets-beloved`}
                  class="uui-field-label"
                >
                  Beneficiary <Loading loading={!belovedList.isReady} />
                </label>
                <select
                  id={`select-digital-assets-beloved`}
                  required
                  class="form-select"
                >
                  {belovedList.data.map((item) => (
                    <option key={item.value} value={item.value}>
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
                  Remarks
                </label>
                <textarea
                  class="form-control"
                  id={`input-digital-assets-remarks`}
                  placeholder="Type your message..."
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
                    You agree to our friendly{' '}
                    <Link href="policy" target="_blank">
                      privacy policy.
                    </Link>
                  </label>
                </div>
              </div>

              <div class="d-grid gap-2 mt-5">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading
                    title={digitalAssetsTypeName[keyType].button_title}
                    loading={isLoading.update}
                  />
                </button>
                {digitalAssetsTypeName[keyType].allow_delete ? (
                  <button
                    type="button"
                    class="btn btn-light btn-lg btn-text"
                    onClick={deleteDigitalAssets}
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

export default DigitalAssetsModal;
