import { addUserImg } from '../constant/element';
import { instructionsAfterDeath, trueFalse } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { deleteImage, getOptionLabelWithIcon } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useId } from 'react';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

const digitalAssetsTypeName = {
  add: {
    key: 'add',
    button_title: 'Add',
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

const instructionTypeConfig = {
  add: {
    faraid: {
      title: 'Add Assets to be Faraid',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      actionFormLabel: 'Which Assets you want to Faraid?',
      showInsuranceForm: false,
    },
    terminate: {
      title: 'Add Assets to be Terminate',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      actionFormLabel: 'Which Assets you want to Terminate?',
      showInsuranceForm: false,
    },
    transfer_as_gift: {
      title: 'Add Assets to be Transfer as Gift',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      actionFormLabel: 'Which Assets you want to Transfer as Gift?',
      showInsuranceForm: false,
    },
    settle: {
      title: 'Add Debt to be Settled',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      actionFormLabel: 'Which Debt you want to be settled?',
      showInsuranceForm: true,
    },
  },
  edit: {
    faraid: {
      title: 'Update Faraid Asset',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      showInsuranceForm: false,
    },
    terminate: {
      title: 'Update Terminate Asset',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      showInsuranceForm: false,
    },
    transfer_as_gift: {
      title: 'Update Transfer as Gift Asset',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      showInsuranceForm: false,
    },
    settle: {
      title: 'Update Debt to be Settled',
      description: `Fill in the asset name, it's value, and any additional notes or details.`,
      showInsuranceForm: true,
    },
  },
};

const DigitalAssetsModal = ({ isModalView = true, onSuccess = () => {} }) => {
  const { contextApiData, getDigitalAssets, addDigitalAssetsApi } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const { isModalOpen, toggleModal } = useModal();

  const keyType = tempData.assets.key;
  const selectedItem = tempData.assets.selectedItem;

  const useUniqueId = () => {
    const [id, setId] = useState('');

    useEffect(() => {
      setId(`id-${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    return id;
  };

  const uniqueId = useUniqueId();
  const router = useRouter();

  const [mutiselectData, setMultiSelectData] = useState({
    platform: {
      selected: [],
    },
  });

  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
    content: false,
  });

  useEffect(() => {
    if (keyType == 'add') {
      clearSelectedItem();
    }
  }, [keyType]);

  useEffect(() => {
    if (selectedItem && keyType == 'edit') {
      setMultiSelectData({
        platform: {
          selected: [],
        },
      });

      setIsLoading({
        ...isLoading,
        content: true,
      });

      if (selectedItem?.new_service_platform_name) {
        handleChangeMultiSelect({
          keyName: 'platform',
          newValues: {
            isCustom: true,
            instructionsAfterDeath: selectedItem.instructions_after_death,
            platformName: selectedItem.new_service_platform_name,
            websiteUrl: selectedItem.new_service_platform_url,
            amount: selectedItem.declared_value_myr,
            protection: selectedItem.protection,
            remarks: selectedItem.remarks,
          },
        });
        setIsLoading({
          ...isLoading,
          content: false,
        });
      } else {
        if (contextApiData.bodies.data?.length > 0) {
          var foundObject = contextApiData.bodies.data.find(
            (obj) => obj.id === selectedItem.bodies_id
          );

          if (foundObject) {
            foundObject.label = foundObject.name;
            foundObject.value = foundObject.id;
            foundObject.instructionsAfterDeath =
              selectedItem.instructions_after_death;
            foundObject.amount = selectedItem.declared_value_myr;
            foundObject.protection = selectedItem.protection;
            foundObject.remarks = selectedItem.remarks;

            handleChangeMultiSelect({
              keyName: 'platform',
              newValues: foundObject,
            });

            setIsLoading({
              ...isLoading,
              content: false,
            });
          }
        }
      }
    }
  }, [selectedItem]);

  const clearSelectedItem = () => {
    setMultiSelectData({
      platform: {
        selected: [],
      },
    });
    setValueTempData('assets', {
      ...tempData.assets,
      selectedItem: null,
    });
  };

  const addDigitalAssets = async () => {
    var addData = [];
    mutiselectData.platform.selected.map((item) => {
      const baseData = {
        uuid: contextApiData.user.data?.id,
        instructions_after_death: item?.instructionsAfterDeath
          ? item.instructionsAfterDeath
          : tempData.assets.instructionType,
        declared_value_myr: item.amount,
        protection: item?.protection || null,
        remarks: item?.remarks || '',
      };

      if (item.isCustom) {
        addData.push({
          ...baseData,
          new_service_platform_name: item.platformName,
          new_service_platform_url: item.websiteUrl,
        });
      } else {
        addData.push({
          ...baseData,
          bodies_id: item.value,
        });
      }
    });

    const result = await addDigitalAssetsApi(addData);

    if (result) {
      toast.success(translations[locale].global.successfully_submitted);

      if (onSuccess) {
        onSuccess();
      } else {
        toggleModal('assets');
      }
    } else {
      setIsLoading({
        ...isLoading,
        update: false,
      });
    }

    setIsLoading({
      ...isLoading,
      update: false,
    });
  };

  const editDigitalAssets = async () => {
    const updatedData = mutiselectData.platform.selected[0];

    var addData = {
      declared_value_myr: updatedData.amount,
      protection: updatedData?.protection,
      remarks: updatedData?.remarks ? updatedData.remarks : '',
      instructions_after_death: updatedData.instructionsAfterDeath,
    };

    if (updatedData?.isCustom) {
      addData.new_service_platform_name = updatedData.platformName;
      addData.new_service_platform_url = updatedData.websiteUrl;
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

    toggleModal('assets');

    toast.success(translations[locale].global.successfully_updated);

    getDigitalAssets();

    setIsLoading({
      ...isLoading,
      update: false,
    });
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

      toggleModal('assets');

      toast.success(translations[locale].global.successfully_deleted);

      getDigitalAssets();

      setIsLoading({
        ...isLoading,
        delete: false,
      });
    }
  };

  const onSubmitAddDigitalAssets = async (event) => {
    event.preventDefault();

    if (mutiselectData.platform.selected.length > 0) {
      setIsLoading({
        ...isLoading,
        update: true,
      });

      if (keyType == 'add') {
        await addDigitalAssets();
      }
      if (keyType == 'edit') {
        await editDigitalAssets();
      }
    } else {
      toast.error('Please add your assets.');
    }
  };

  const handleChangeMultiSelect = ({ keyName, newValues }) => {
    // if item is deleted the coming newValues is array not object
    setMultiSelectData((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        selected: Array.isArray(newValues)
          ? newValues
          : [...prevState[keyName].selected, ...[newValues]],
      },
    }));
  };

  const handleMultiSelectInputChange = (index, newValue, keyName, subKey) => {
    const updatedSelected = [...mutiselectData[keyName].selected];
    updatedSelected[index][subKey] = newValue;
    setMultiSelectData((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        selected: updatedSelected,
      },
    }));
  };

  const getBodyData = () => {
    const bodyData = contextApiData.bodies.data
      ?.filter(
        (item) =>
          item.category !== 'sadaqah_waqaf_zakat' && item.category !== 'waqaf'
      )
      .map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));

    if (bodyData?.length > 0) {
      return bodyData;
    } else {
      return [];
    }
  };

  const featuredIconList = () => {
    const data = getBodyData();
    const maxRows = 3;
    const totalItems = data.length;
    const itemsPerRow = Math.ceil(totalItems / maxRows);

    if (data.length == 0) {
      return (
        <div class="text-center mt-5 mb-5">
          <Loading loading={true} />
        </div>
      );
    }

    return (
      <div class="py-3">
        <div class="d-flex text-center mb-2 justify-content-center">
          {data
            ?.filter((item) => item.category == 'physical_assets')
            .map((item, index) => (
              <div key={index}>
                <img
                  loading="lazy"
                  src={
                    item?.icon
                      ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                      : '/images/Displacement-p-500.png'
                  }
                  alt=""
                  className="avatar-8 card-size-onhover"
                  style={{
                    width: 40,
                    height: 40,
                    transition: 'transform 0.5s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    handleChangeMultiSelect({
                      keyName: 'platform',
                      newValues: item,
                    });
                  }}
                  data-tooltip-id={`my-tooltip-${item.label}`}
                  data-tooltip-html={`
                <div>
                  <span>
                  ${item.label} 
                  </span>
                </div>`}
                />
                <Tooltip
                  id={`my-tooltip-${item.label}`}
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
              </div>
            ))}
        </div>
        <div class="mt-3 d-flex text-center mb-2 gap-2 justify-content-center">
          {data
            ?.filter((item) => item.featured == true)
            .map((item, index) => (
              <div key={index}>
                <img
                  loading="lazy"
                  src={
                    item?.icon
                      ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                      : '/images/Displacement-p-500.png'
                  }
                  alt=""
                  className="avatar-8 card-size-onhover"
                  style={{
                    width: 35,
                    height: 35,
                    transition: 'transform 0.5s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    handleChangeMultiSelect({
                      keyName: 'platform',
                      newValues: item,
                    });
                  }}
                  data-tooltip-id={`my-tooltip-${item.label}`}
                  data-tooltip-html={`
                <div>
                  <span>
                  ${item.label} 
                  </span>
                </div>`}
                />
                <Tooltip
                  id={`my-tooltip-${item.label}`}
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
              </div>
            ))}
        </div>
        <div className="overflow-auto">
          <div
            className="d-grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${itemsPerRow}, auto)`,
              gridTemplateRows: `repeat(${maxRows}, auto)`,
            }}
          >
            {data
              .filter((item) => item.category !== 'physical_assets')
              .map((item, index) => (
                <div key={index}>
                  <img
                    loading="lazy"
                    src={
                      item?.icon
                        ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                        : '/images/Displacement-p-500.png'
                    }
                    alt=""
                    className="avatar-8 card-size-onhover"
                    style={{
                      width: 30,
                      height: 30,
                      transition: 'transform 0.5s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleChangeMultiSelect({
                        keyName: 'platform',
                        newValues: item,
                      });
                    }}
                    data-tooltip-id={`my-tooltip-${item.label}`}
                    data-tooltip-html={`
               <div>
                 <span>
                 ${item.label} 
                 </span>
               </div>`}
                  />
                  <Tooltip
                    id={`my-tooltip-${item.label}`}
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
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const bodyContent = () => {
    return (
      <>
        <div class="mb-0 modal-title-01">
          {keyType == 'edit'
            ? instructionTypeConfig[keyType][
                selectedItem?.instructions_after_death
              ]?.title
            : instructionTypeConfig[keyType][tempData.assets.instructionType]
                ?.title}
        </div>
        <div class="modal-subtitle-01">
          {keyType == 'edit'
            ? instructionTypeConfig[keyType][
                selectedItem?.instructions_after_death
              ]?.description
            : instructionTypeConfig[keyType][tempData.assets.instructionType]
                ?.description}
        </div>
        {isLoading.content ? (
          <div class="text-center mt-5 mb-5">
            <Loading loading={true} />
          </div>
        ) : (
          ''
        )}
        {keyType == 'add' ? featuredIconList() : ''}
        <form onSubmit={onSubmitAddDigitalAssets}>
          <div class="form-field-wrapper mb-3">
            <label class="form-label-01">
              {
                instructionTypeConfig[keyType][tempData.assets.instructionType]
                  ?.actionFormLabel
              }
            </label>
            {keyType == 'add' ? (
              <>
                <Select
                  instanceId={uniqueId}
                  isMulti
                  value={mutiselectData.platform.selected}
                  options={getBodyData()}
                  onChange={(newValues) => {
                    handleChangeMultiSelect({
                      keyName: 'platform',
                      newValues: newValues,
                    });
                  }}
                  getOptionLabel={getOptionLabelWithIcon}
                  getOptionValue={(option) => option.label}
                />
                <span class="form-under-label-01">
                  <Image
                    src="images/small-plus.svg"
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 17, height: 17 }}
                    class="me-1"
                  />
                  {
                    translations[locale].component.digital_assets_modal
                      .Cannot_find_your_
                  }{' '}
                  <b
                    class="text-primary pointer-on-hover"
                    onClick={() => {
                      handleChangeMultiSelect({
                        keyName: 'platform',
                        newValues: {
                          isCustom: true,
                          platformName: '',
                          websiteUrl: '',
                          amount: '',
                          value: '',
                        },
                      });
                    }}
                  >
                    {
                      translations[locale].component.digital_assets_modal
                        .add_a_new_
                    }
                  </b>
                </span>
              </>
            ) : (
              ''
            )}
          </div>
          {mutiselectData.platform.selected?.map((item, index) => {
            return (
              <div class="mb-3 card card-muted-01" key={index}>
                <label class="d-flex align-items-center">
                  <img
                    loading="lazy"
                    src={
                      item?.icon
                        ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                        : '/images/Displacement-p-500.png'
                    }
                    alt=""
                    class="avatar-8 me-2"
                    style={{ width: 40, height: 40 }}
                  />{' '}
                  <span class="rounded-icon-title-01">
                    {item?.label ? item.label : 'Platform'}
                  </span>
                </label>
                {keyType == 'edit' || !isModalView ? (
                  <div class="form-field-wrapper mt-2">
                    <label
                      htmlFor={`input-${item.value}-instruction-after-death`}
                      class="form-label-01"
                    >
                      Instruction After Death
                    </label>
                    <select
                      id={`input-${item.value}-instruction-after-death`}
                      class="form-select"
                      value={item.instructionsAfterDeath}
                      onChange={(event) =>
                        handleMultiSelectInputChange(
                          index,
                          event.target.value,
                          'platform',
                          'instructionsAfterDeath'
                        )
                      }
                      required
                    >
                      <option disabled selected value="">
                        Select...
                      </option>
                      {instructionsAfterDeath(
                        contextApiData?.profile?.data?.religion
                      ).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  ''
                )}
                {item?.isCustom ? (
                  <>
                    <div class="form-field-wrapper mt-2">
                      <label
                        htmlFor={`input-${item.value}-new-service-platform-name`}
                        class="form-label-01"
                      >
                        {
                          translations[locale].component.digital_assets_modal
                            .service_provider
                        }
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id={`input-${item.value}-new-service-platform-name`}
                        value={item?.platformName}
                        onChange={(event) =>
                          handleMultiSelectInputChange(
                            index,
                            event.target.value,
                            'platform',
                            'platformName'
                          )
                        }
                        required
                      />
                    </div>
                    <div class="form-field-wrapper mt-2">
                      <label
                        htmlFor={`input-${item.value}-new-service-platform-url`}
                        class="form-label-01"
                      >
                        {
                          translations[locale].component.digital_assets_modal
                            .website_url
                        }
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id={`input-${item.value}-new-service-platform-url`}
                        value={item?.websiteUrl}
                        onChange={(event) =>
                          handleMultiSelectInputChange(
                            index,
                            event.target.value,
                            'platform',
                            'websiteUrl'
                          )
                        }
                        required
                      />
                    </div>
                  </>
                ) : (
                  ''
                )}
                <div class="form-field-wrapper mt-2">
                  <label
                    htmlFor={`input-platform-${item.value}-estimate-value`}
                    class="form-label-01"
                  >
                    Estimation Value
                  </label>
                  <div class="input-group">
                    <div class="input-group-text">RM</div>
                    <input
                      type="number"
                      step="0.01"
                      class="form-control"
                      id={`input-platform-${item.value}-estimate-value`}
                      value={item.amount}
                      onChange={(event) =>
                        handleMultiSelectInputChange(
                          index,
                          event.target.value,
                          'platform',
                          'amount'
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div
                  class="form-field-wrapper mt-2"
                  style={{
                    display: instructionTypeConfig[keyType][
                      keyType == 'edit'
                        ? selectedItem?.instructions_after_death
                        : tempData.assets.instructionType
                    ]?.showInsuranceForm
                      ? 'block'
                      : 'none',
                  }}
                >
                  <label
                    htmlFor={`input-${item.value}-protection`}
                    class="form-label-01"
                  >
                    Is this asset protected under insurance or takaful?
                  </label>
                  <select
                    id={`input-${item.value}-protection`}
                    class="form-select"
                    value={item.protection}
                    onChange={(event) =>
                      handleMultiSelectInputChange(
                        index,
                        event.target.value,
                        'platform',
                        'protection'
                      )
                    }
                    required={
                      instructionTypeConfig[keyType][
                        keyType == 'edit'
                          ? selectedItem?.instructions_after_death
                          : tempData.assets.instructionType
                      ]?.showInsuranceForm
                        ? true
                        : false
                    }
                  >
                    <option disabled selected value="">
                      Select...
                    </option>
                    {trueFalse().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="form-field-wrapper mt-2">
                  <label
                    htmlFor={`input-${item.value}-remarks`}
                    class="form-label-01"
                  >
                    Anything else you would like to share?
                  </label>
                  <textarea
                    class="form-control"
                    id={`input-${item.value}-remarks`}
                    value={item.remarks}
                    onChange={(event) =>
                      handleMultiSelectInputChange(
                        index,
                        event.target.value,
                        'platform',
                        'remarks'
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
          <div class="mt-3">
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
      </>
    );
  };

  if (isModalView) {
    return (
      <Modal
        show={isModalOpen.assets}
        onHide={() => {
          toggleModal('assets');
          clearSelectedItem();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Image
              src="images/flag-icon.svg"
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 40, height: 40 }}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{bodyContent()}</Modal.Body>
      </Modal>
    );
  } else {
    return bodyContent();
  }
};

export default DigitalAssetsModal;

// The summary of this page includes:
// This page described is designed to ensure these assets are handled appropriately after the user's death.
// It allows users to add or edit details of their digital accounts, such as email, platform details, subscription type, payment frequency, estimated value, and instructions for after death.
// Users can also nominate trusted individuals to manage these accounts.
// The form includes options to add new platform details and supports creating multiple entries if needed.
