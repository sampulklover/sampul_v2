import { addUserImg } from '../constant/element';
import {
  banks,
  belovedLevel,
  beneficiaryTypes,
  countries,
  currencies,
  donationCategories,
  donationDurations,
  estimatedNetWorths,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import {
  deleteImage,
  mapViewElements,
  renderField,
  replaceOrAddImage,
} from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

const CharityModal = () => {
  const { contextApiData, addTrustCharity, deleteTrustCharity } = useApi();
  const { locale } = useLocale();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const charityType = tempData.charity.key ? tempData.charity.key : 'add';

  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
    delete: {
      isLoading: false,
    },
  });

  useEffect(() => {
    if (isModalOpen.charity) {
      if (tempData.charity.selectedItem) {
        mapViewElements({
          source: tempData.charity.selectedItem,
          target: elementList().profile.elements,
          viewOnly: false,
        });
      }
    }
  }, [isModalOpen.charity]);

  const handleClose = () => {
    toggleModal('charity');
    setValueTempData('charity', {
      ...tempData.charity,
      key: 'add',
      selectedItem: null,
    });
  };

  const elementList = () => ({
    profile: {
      elements: {
        organization_name: document.getElementById('input-organization-name'),
        address_line_1: document.getElementById('input-address-1'),
        address_line_2: document.getElementById('input-address-2'),
        city: document.getElementById('input-city'),
        postcode: document.getElementById('input-postcode'),
        state: document.getElementById('input-state'),
        country: document.getElementById('select-country'),
        phone_no: document.getElementById('input-phone-no'),
        email: document.getElementById('input-email'),
        category: document.getElementById('select-category'),
        bank: document.getElementById('select-bank'),
        account_number: document.getElementById('input-account-number'),
        donation_amount: document.getElementById('input-donation-amount'),
        donation_duration: document.getElementById('select-duration'),
      },
    },
  });

  const onSubmitForm = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      submit: {
        ...buttonConfig.submit,
        isLoading: true,
      },
    });

    const elements = elementList().profile.elements;

    const formData = Object.fromEntries(
      Object.entries(elements)
        .map(([key, element]) => [key, element?.value])
        .filter(([_, value]) => value !== undefined && value !== '')
    );

    try {
      if (charityType === 'add') {
        const result = await addTrustCharity({
          ...formData,
          trust_id: tempData.trust.selectedItem.id,
        });

        if (result) {
          toast.success('Added');
          handleClose();
        }
      }

      if (charityType === 'edit') {
        const result = await addTrustCharity({
          ...formData,
          id: tempData.charity.selectedItem.id,
        });

        if (result) {
          toast.success('Updated');
          handleClose();
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setButtonConfig({
        ...buttonConfig,
        submit: {
          ...buttonConfig.submit,
          isLoading: false,
        },
      });
    }
  };

  const onDeleteorganization = async () => {
    if (confirm(translations[locale].global.delete_confirmation)) {
      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: true,
        },
      });

      const result = await deleteTrustCharity({
        id: tempData.charity.selectedItem.id,
      });

      if (result) {
        toast.success(translations[locale].global.successfully_deleted);
        handleClose();
      }

      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: false,
        },
      });
    }
  };

  const formContainerConfig = {
    general: (
      <div>
        <form onSubmit={onSubmitForm}>
          {renderField({
            label: translations[locale].trust.charity_info.organization_name,
            id: 'input-organization-name',
          })}
          {renderField({
            label: translations[locale].trust.charity_info.address_line_1,
            id: 'input-address-1',
          })}
          {renderField({
            label: translations[locale].trust.charity_info.address_line_2,
            id: 'input-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.charity_info.city,
              id: 'input-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.charity_info.postcode,
              id: 'input-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.charity_info.state_province,
              id: 'input-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.charity_info.country,
              id: 'select-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.charity_info.contact_no,
              id: 'input-phone-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.charity_info.email,
              id: 'input-email',
              type: 'email',
              className: 'w-100 w-md-50',
            })}
          </div>
          {renderField({
            label: translations[locale].trust.charity_info.category,
            id: 'select-category',
            options: donationCategories(),
          })}
          {renderField({
            label: translations[locale].trust.charity_info.bank_name,
            id: 'select-bank',
            options: banks(),
          })}
          {renderField({
            label: translations[locale].trust.charity_info.account_number,
            id: 'input-account-number',
            type: 'number',
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.charity_info.donation_amount,
              id: 'input-donation-amount',
              type: 'number',
              step: '0.01',
              min: '0.01',
              className: 'w-70 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.charity_info.duration,
              id: 'select-duration',
              options: donationDurations(),
            })}
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary btn-text">
              <Loading
                title={
                  translations[locale].trust.charity_info[
                    charityType === 'add' ? 'add' : 'update'
                  ]
                }
                loading={buttonConfig.submit.isLoading}
              />
            </button>
            {charityType == 'edit' && (
              <button
                type="button"
                class="btn btn-outline-danger btn-text"
                onClick={onDeleteorganization}
              >
                <Loading
                  title={translations[locale].trust.charity_info.delete}
                  loading={buttonConfig.delete.isLoading}
                />
              </button>
            )}
          </div>
        </form>
      </div>
    ),
  };

  const viewConfig = {
    add: {
      modalTitle: translations[locale].trust.charity_info.add_charity,
      body: formContainerConfig.general,
    },
    edit: {
      modalTitle: translations[locale].trust.charity_info.edit_organization,
      body: formContainerConfig.general,
    },
  };

  return (
    <Modal show={isModalOpen.charity} onHide={handleClose} class="modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">{viewConfig[charityType]?.modalTitle}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{viewConfig[charityType]?.body}</div>
      </Modal.Body>
    </Modal>
  );
};

export default CharityModal;
