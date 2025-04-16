import { addUserImg } from '../constant/element';
import {
  countries,
  estimatedNetWorths,
  genders,
  industries,
  pepTypes,
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

const TrustClientInfo = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, addTrust } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const formRef = useRef(null);
  const [trustData, setTrustData] = useState({});

  useEffect(() => {
    if (contextApiData.trust.data) {
      if (
        contextApiData.trust.data.length > 0 &&
        tempData.trust.selectedItem?.id
      ) {
        const foundTrust = contextApiData.trust.data.find(
          (trust) => trust.id === tempData.trust.selectedItem.id
        );

        if (foundTrust) {
          mapViewElements({
            source: foundTrust,
            target: elementList().profile.elements,
            viewOnly: false,
          });
          setTrustData(foundTrust);
        } else {
          console.log('No matching trust found.');
        }
      }
    }
  }, [contextApiData.trust.data]);

  useEffect(() => {
    if (onSubmitToggle > 0) {
      formRef.current?.requestSubmit();
    }
  }, [onSubmitToggle]);

  const generateTurstId = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 10000000000);
    const randomId = `TRUST-${currentYear}-${randomDigits
      .toString()
      .padStart(10, '0')}`;

    return randomId;
  };

  const onSubmitForm = async () => {
    const elements = elementList().profile.elements;
    const formData = removeEmptyKeyValue(elements);
    var newTrustData = { ...trustData, ...formData };

    try {
      if (newTrustData?.id) {
        const {
          trust_beneficiary,
          trust_charity,
          trust_payment,
          ...filteredTrustData
        } = newTrustData;
        newTrustData = filteredTrustData;
      } else {
        newTrustData.trust_code = generateTurstId();
      }

      const result = await addTrust({
        trustData: newTrustData,
      });

      setValueTempData('trust', {
        ...tempData.trust,
        selectedItem: result,
      });

      if (result) {
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
        name: document.getElementById('input-name'),
        nric_number: document.getElementById('input-nric-no'),
        dob: document.getElementById('select-dob'),
        gender: document.getElementById('select-gender'),
        resident_status: document.getElementById('select-resident-status'),
        nationality: document.getElementById('select-nationality'),
        phone_no: document.getElementById('input-phone-no'),
        email: document.getElementById('input-email'),
        address_line_1: document.getElementById('input-address-1'),
        address_line_2: document.getElementById('input-address-2'),
        city: document.getElementById('input-city'),
        postcode: document.getElementById('input-postcode'),
        state: document.getElementById('input-state'),
        country: document.getElementById('select-country'),
        estimated_net_worth: document.getElementById(
          'select-estimated-net-worth'
        ),
        source_of_fund: document.getElementById('input-fund-source'),
        purpose_of_transaction: document.getElementById(
          'input-purpose-transaction'
        ),
        employer_name: document.getElementById('input-employer-name'),
        business_nature: document.getElementById('input-business-nature'),
        business_address_line_1: document.getElementById(
          'input-business-address-1'
        ),
        business_address_line_2: document.getElementById(
          'input-business-address-2'
        ),
        business_city: document.getElementById('input-business-city'),
        business_postcode: document.getElementById('input-business-postcode'),
        business_state: document.getElementById('input-business-state'),
        business_country: document.getElementById('select-business-country'),
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
            <strong>
              {translations[locale].trust.client_info.personal_information}
            </strong>
          </h4>
          <small className="text-muted mb-3">
            {translations[locale].trust.client_info.personal_information_desc}
          </small>

          {renderField({
            label: translations[locale].trust.client_info.name,
            id: 'input-name',
            textUnder: translations[locale].trust.client_info.name_as_per,
            required: true,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.nric_passport,
              id: 'input-nric-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.client_info.date_of_birth,
              id: 'select-dob',
              className: 'w-100 w-md-50',
              type: 'date',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.gender,
              id: 'select-gender',
              options: genders(),
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.client_info.resident_status,
              id: 'select-resident-status',
              options: residentStatus(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.nationality,
              id: 'select-nationality',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.phone,
              id: 'input-phone-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.client_info.email,
              id: 'input-email',
              type: 'email',
              className: 'w-100 w-md-50',
            })}
          </div>
          <h4 className="uui-field-label mt-4">
            <strong>
              {translations[locale].trust.client_info.corresponding_address}
            </strong>
          </h4>
          {renderField({
            label: translations[locale].trust.client_info.address_line_1,
            id: 'input-address-1',
          })}
          {renderField({
            label: translations[locale].trust.client_info.address_line_2,
            id: 'input-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.city,
              id: 'input-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.client_info.postcode,
              id: 'input-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.state_province,
              id: 'input-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: translations[locale].trust.client_info.country,
              id: 'select-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>

          <h4 className="uui-field-label mt-4">
            <strong>
              {translations[locale].trust.client_info.other_information}
            </strong>
          </h4>
          {renderField({
            label: translations[locale].trust.client_info.estimated_net_worth,
            id: 'select-estimated-net-worth',
            options: estimatedNetWorths(),
          })}
          {renderField({
            label: translations[locale].trust.client_info.source_of_fund,
            id: 'input-fund-source',
          })}
          {renderField({
            label:
              translations[locale].trust.client_info.purpose_of_transaction,
            id: 'input-purpose-transaction',
          })}

          <h4 className="uui-field-label mt-4">
            <strong>
              {translations[locale].trust.client_info.employment_info}
            </strong>
          </h4>
          {renderField({
            label: translations[locale].trust.client_info.employer_name,
            id: 'input-employer-name',
            required: false,
          })}
          {renderField({
            label: translations[locale].trust.client_info.business_nature,
            id: 'input-business-nature',
            required: false,
          })}
          {renderField({
            label:
              translations[locale].trust.client_info.business_address_line_1,
            id: 'input-business-address-line-1',
            required: false,
          })}
          {renderField({
            label:
              translations[locale].trust.client_info.business_address_line_2,
            id: 'input-business-address-line-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: translations[locale].trust.client_info.business_city,
              id: 'input-business-city',
              className: 'w-100 w-md-50',
              required: false,
            })}
            {renderField({
              label: translations[locale].trust.client_info.business_postcode,
              id: 'input-business-postcode',
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label:
                translations[locale].trust.client_info.business_state_province,
              id: 'input-business-state',
              className: 'w-100 w-md-50',
              required: false,
            })}
            {renderField({
              label: translations[locale].trust.client_info.business_country,
              id: 'select-business-country',
              options: countries(),
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustClientInfo;
