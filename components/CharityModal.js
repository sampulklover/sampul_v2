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
            label: 'Name of organization',
            id: 'input-organization-name',
          })}
          {renderField({
            label: 'Address Line 1',
            id: 'input-address-1',
          })}
          {renderField({
            label: 'Address Line 2',
            id: 'input-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'City',
              id: 'input-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Postcode',
              id: 'input-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'State / Province',
              id: 'input-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Country',
              id: 'select-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Contact no',
              id: 'input-phone-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Email',
              id: 'input-email',
              type: 'email',
              className: 'w-100 w-md-50',
            })}
          </div>
          {renderField({
            label: 'Category',
            id: 'select-category',
            options: donationCategories(),
          })}
          {renderField({
            label: 'Bank Name',
            id: 'select-bank',
            options: banks(),
          })}
          {renderField({
            label: 'Account Number',
            id: 'input-account-number',
            type: 'number', // Assuming account number is numeric
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Donation Amount (RM)',
              id: 'input-donation-amount',
              type: 'number',
              step: '0.01', // Allow decimal values for cents
              min: '0.01', // Minimum donation amount
              className: 'w-70 w-md-50',
            })}
            {renderField({
              label: 'Duration',
              id: 'select-duration',
              options: donationDurations(),
            })}
          </div>
          <div class="d-grid gap-2 mt-5">
            <button type="submit" class="btn btn-primary btn-text">
              <Loading
                title={charityType == 'add' ? 'Add' : 'Update'}
                loading={buttonConfig.submit.isLoading}
              />
            </button>
            {charityType == 'edit' ? (
              <button
                type="button"
                class="btn btn-outline-danger btn-text"
                onClick={() => {
                  onDeleteorganization();
                }}
              >
                <Loading
                  title={'Delete'}
                  loading={buttonConfig.delete.isLoading}
                />
              </button>
            ) : (
              ''
            )}
          </div>
        </form>
      </div>
    ),
  };

  const viewConfig = {
    add: {
      modalTitle: 'Add a new charity',
      body: formContainerConfig.general,
    },
    edit: {
      modalTitle: 'Edit organization',
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
