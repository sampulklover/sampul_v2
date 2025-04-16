import { addUserImg } from '../constant/element';
import {
  countries,
  estimatedNetWorths,
  executorRelationships,
  genders,
  industries,
  pepTypes,
  relationships,
  residentStatus,
  trueFalse,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import {
  mapViewElements,
  removeEmptyKeyValue,
  renderField,
} from '../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const ExecutorGuardianInfo = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, addExecutorGuardian } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const formRef = useRef(null);

  useEffect(() => {
    if (contextApiData.executor.data) {
      if (
        contextApiData.executor.data.length > 0 &&
        tempData.executor.selectedItem?.id
      ) {
        const foundExecutor = contextApiData.executor.data.find(
          (executor) => executor.id === tempData.executor.selectedItem.id
        );

        if (foundExecutor?.executor_guardian) {
          setTimeout(() => {
            mapViewElements({
              source: foundExecutor.executor_guardian,
              target: elementList().profile.elements,
              viewOnly: false,
            });
          }, 200);
        } else {
          console.log('No matching executor found.');
        }
      }
    }
  }, [contextApiData.executor.data]);

  useEffect(() => {
    if (onSubmitToggle > 0) {
      formRef.current?.requestSubmit();
    }
  }, [onSubmitToggle]);

  const onSubmitForm = async () => {
    const elements = elementList().profile.elements;
    const formData = removeEmptyKeyValue(elements);
    var newData = {
      executor_id: tempData.executor.selectedItem.id,
      ...formData,
    };

    try {
      const result = await addExecutorGuardian({
        data: newData,
      });

      if (result) {
        setValueTempData('executor', {
          ...tempData.executor,
          selectedItem: result,
        });

        toast.success('Saved!');
        nextStep();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const elementList = () => ({
    profile: {
      elements: {
        full_name: document.getElementById('input-full-name'),
        nric_new: document.getElementById('input-nric-new'),
        nric_old: document.getElementById('input-nric-old'),
        police_army_nric: document.getElementById('input-police-army-nric'),
        date_of_birth: document.getElementById('input-date-of-birth'),
        age: document.getElementById('input-age'),
        address_line_1: document.getElementById(
          'input-correspondence-address-1'
        ),
        address_line_2: document.getElementById(
          'input-correspondence-address-2'
        ),
        city: document.getElementById('input-correspondence-city'),
        postcode: document.getElementById('input-correspondence-postcode'),
        state: document.getElementById('input-correspondence-state'),
        country: document.getElementById('select-correspondence-country'),
        phone_no: document.getElementById('input-phone-no'),
        home_phone: document.getElementById('input-home-phone'),
        office_phone: document.getElementById('input-office-phone'),
        email: document.getElementById('input-email'),
        relationship: document.getElementById('select-relationship'),
      },
    },
  });

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        <div className="card">
          <h4 className="uui-field-label mb-0">
            <strong>Particulars of Guardian</strong>
          </h4>

          {renderField({
            label: 'Full Name',
            id: 'input-full-name',
            textUnder: '(As stated in NRIC)',
            required: true,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'NRIC No. (New)',
              id: 'input-nric-new',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'NRIC No. (Old)',
              id: 'input-nric-old',
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>
          {renderField({
            label: 'Police/Army NRIC No.',
            id: 'input-police-army-nric',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Date of Birth',
              id: 'input-date-of-birth',
              type: 'date',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Age',
              id: 'input-age',
              type: 'number',
              className: 'w-100 w-md-50',
            })}
          </div>
          <h4 className="uui-field-label mt-4">
            <strong>Corresponding Address:</strong>
          </h4>
          {renderField({
            label: 'Address Line 1',
            id: 'input-correspondence-address-1',
          })}
          {renderField({
            label: 'Address Line 2',
            id: 'input-correspondence-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'City',
              id: 'input-correspondence-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Postcode',
              id: 'input-correspondence-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'State / Province',
              id: 'input-correspondence-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Country',
              id: 'select-correspondence-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Telephone/Mobile',
              id: 'input-phone-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Home Telephone Number',
              id: 'input-home-phone',
              className: 'w-100 w-md-50',
              required: false,
            })}
            {renderField({
              label: 'Office Telephone Number',
              id: 'input-office-phone',
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>
          {renderField({
            label: 'Email',
            id: 'input-email',
            type: 'email',
          })}
          {renderField({
            label: 'Relationship',
            id: 'select-relationship',
            options: executorRelationships(),
          })}
        </div>
      </form>
    </div>
  );
};

export default ExecutorGuardianInfo;
