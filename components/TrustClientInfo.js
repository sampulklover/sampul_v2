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
            <strong>Personal Information</strong>
          </h4>
          <small className="text-muted mb-3">
            Your details will help us tailor the trust to your needs.
          </small>

          {renderField({
            label: 'Name',
            id: 'input-name',
            textUnder: '(same as NRIC/Passport/)',
            required: true,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'NRIC/Passport Number',
              id: 'input-nric-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Date of Birth',
              id: 'select-dob',
              className: 'w-100 w-md-50',
              type: 'date',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Gender',
              id: 'select-gender',
              options: genders(),
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Resident Status',
              id: 'select-resident-status',
              options: residentStatus(),
              className: 'w-100 w-md-50',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'Nationality',
              id: 'select-nationality',
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
              label: 'Email',
              id: 'input-email',
              type: 'email',
              className: 'w-100 w-md-50',
            })}
          </div>
          <h4 className="uui-field-label mt-4">
            <strong>Corresponding Address:</strong>
          </h4>
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

          <h4 className="uui-field-label mt-4">
            <strong>Other Information</strong>
          </h4>
          {renderField({
            label: 'Estimate Net Worth',
            id: 'select-estimated-net-worth',
            options: estimatedNetWorths(),
          })}
          {renderField({
            label: 'Source of Fund',
            id: 'input-fund-source',
          })}
          {renderField({
            label: 'Purpose of Transaction',
            id: 'input-purpose-transaction',
          })}

          <h4 className="uui-field-label mt-4">
            <strong>
              Employement Information (employed individual / self-employed):
            </strong>
          </h4>
          {renderField({
            label: 'Name of Employer/ Name of Business',
            id: 'input-employer-name',
          })}
          {renderField({
            label: 'Nature of Business:',
            id: 'input-business-nature',
          })}
          {renderField({
            label: 'Business Address Line 1',
            id: 'input-business-address-1',
          })}
          {renderField({
            label: 'Business Address Line 2',
            id: 'input-business-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'City',
              id: 'input-business-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Postcode',
              id: 'input-business-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: 'State / Province',
              id: 'input-business-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: 'Country',
              id: 'select-business-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustClientInfo;
