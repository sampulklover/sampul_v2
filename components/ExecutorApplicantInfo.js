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

const ExecutorApplicantInfo = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, addExecutor } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const formRef = useRef(null);
  const [executorData, setExecutorData] = useState({});
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [relationship, setRelationship] = useState('');
  const t = translations[locale].executor.applicant_info;

  useEffect(() => {
    if (contextApiData.executor.data) {
      if (
        contextApiData.executor.data.length > 0 &&
        tempData.executor.selectedItem?.id
      ) {
        const foundExecutor = contextApiData.executor.data.find(
          (executor) => executor.id === tempData.executor.selectedItem.id
        );

        if (foundExecutor) {
          setIsSameAddress(foundExecutor.is_same_address || false);
          setRelationship(foundExecutor.relationship_with_deceased || '');
          setTimeout(() => {
            mapViewElements({
              source: foundExecutor,
              target: elementList().profile.elements,
              viewOnly: false,
            });
            setExecutorData(foundExecutor);
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

  const generateExecutorId = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 10000000000);
    const randomId = `EXECUTOR-${currentYear}-${randomDigits
      .toString()
      .padStart(10, '0')}`;

    return randomId;
  };

  const handleSameAddressToggle = () => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      const elements = elementList().profile.elements;
      document.getElementById('input-correspondence-address-1').value =
        elements.address_line_1.value;
      document.getElementById('input-correspondence-address-2').value =
        elements.address_line_2.value;
      document.getElementById('input-correspondence-city').value =
        elements.city.value;
      document.getElementById('input-correspondence-postcode').value =
        elements.postcode.value;
      document.getElementById('input-correspondence-state').value =
        elements.state.value;
      document.getElementById('select-correspondence-country').value =
        elements.country.value;
    }
  };

  const handleRelationshipChange = (event) => {
    setRelationship(event.target.value);
  };

  const onSubmitForm = async () => {
    const elements = elementList().profile.elements;
    const formData = removeEmptyKeyValue(elements);

    if (relationship === 'others') {
      const otherRelationship = document.getElementById(
        'input-other-relationship'
      )?.value;
      formData.other_relationship = otherRelationship || '';
    } else {
      formData.other_relationship = '';
    }

    var newExecutorData = {
      ...executorData,
      ...formData,
      is_same_address: isSameAddress,
    };

    try {
      if (newExecutorData?.id) {
        const {
          executor_deceased,
          executor_deceased_assets,
          executor_guardian,
          ...filteredExecutorData
        } = newExecutorData;
        newExecutorData = filteredExecutorData;
      } else {
        newExecutorData.executor_code = generateExecutorId();
      }

      const result = await addExecutor({
        executorData: newExecutorData,
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
        name: document.getElementById('input-name'),
        nric_number: document.getElementById('input-nric-no'),
        age: document.getElementById('input-age'),
        phone_no: document.getElementById('input-phone-no'),
        home_phone: document.getElementById('input-home-phone'),
        office_phone: document.getElementById('input-office-phone'),
        email: document.getElementById('input-email'),

        address_line_1: document.getElementById('input-address-1'),
        address_line_2: document.getElementById('input-address-2'),
        city: document.getElementById('input-city'),
        postcode: document.getElementById('input-postcode'),
        state: document.getElementById('input-state'),
        country: document.getElementById('select-country'),
        is_same_address: document.getElementById('same-address-checkbox'),
        relationship_with_deceased: document.getElementById(
          'select-relationship'
        ),
        other_relationship: document.getElementById('input-other-relationship'),
        correspondence_address_line_1: document.getElementById(
          'input-correspondence-address-1'
        ),
        correspondence_address_line_2: document.getElementById(
          'input-correspondence-address-2'
        ),
        correspondence_city: document.getElementById(
          'input-correspondence-city'
        ),
        correspondence_postcode: document.getElementById(
          'input-correspondence-postcode'
        ),
        correspondence_state: document.getElementById(
          'input-correspondence-state'
        ),
        correspondence_country: document.getElementById(
          'select-correspondence-country'
        ),
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
            <strong>{t.personal_information}</strong>
          </h4>
          <small className="text-muted mb-3">{t.personal_info_desc}</small>

          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.name,
              id: 'input-name',
              textUnder: t.name_as_per,
              required: true,
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.nric_passport,
              id: 'input-nric-no',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.age,
              id: 'input-age',
              className: 'w-100 w-md-50',
              type: 'number',
            })}
            {renderField({
              label: t.email,
              id: 'input-email',
              type: 'email',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.telephone_mobile,
              id: 'input-phone-no',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.home_telephone,
              id: 'input-home-phone',
              className: 'w-100 w-md-50',
              required: false,
            })}
            {renderField({
              label: t.office_telephone,
              id: 'input-office-phone',
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>

          {renderField({
            label: t.relationship_with_deceased,
            id: 'select-relationship',
            options: executorRelationships(),
            onChange: handleRelationshipChange,
          })}
          {relationship === 'others' &&
            renderField({
              label: t.specify_relationship,
              id: 'input-other-relationship',
              required: true,
            })}

          <h4 className="uui-field-label mt-4">
            <strong>{t.permanent_address}</strong>
          </h4>
          {renderField({
            label: t.address_line_1,
            id: 'input-address-1',
          })}
          {renderField({
            label: t.address_line_2,
            id: 'input-address-2',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.city,
              id: 'input-city',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.postcode,
              id: 'input-postcode',
              className: 'w-100 w-md-50',
            })}
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.state_province,
              id: 'input-state',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.country,
              id: 'select-country',
              options: countries(),
              className: 'w-100 w-md-50',
            })}
          </div>
          <h4 className="uui-field-label mt-4">
            <strong>{t.corresponding_address}</strong>
          </h4>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="same-address-checkbox"
              className="form-check-input"
              checked={isSameAddress}
              onChange={handleSameAddressToggle}
            />
            <label htmlFor="same-address-checkbox" className="form-check-label">
              {t.same_as_permanent}
            </label>
          </div>
          {!isSameAddress && (
            <>
              {renderField({
                label: t.address_line_1,
                id: 'input-correspondence-address-1',
              })}
              {renderField({
                label: t.address_line_2,
                id: 'input-correspondence-address-2',
                required: false,
              })}
              <div className="d-flex flex-column flex-md-row gap-3">
                {renderField({
                  label: t.city,
                  id: 'input-correspondence-city',
                  className: 'w-100 w-md-50',
                })}
                {renderField({
                  label: t.postcode,
                  id: 'input-correspondence-postcode',
                  className: 'w-100 w-md-50',
                })}
              </div>
              <div className="d-flex flex-column flex-md-row gap-3">
                {renderField({
                  label: t.state_province,
                  id: 'input-correspondence-state',
                  className: 'w-100 w-md-50',
                })}
                {renderField({
                  label: t.country,
                  id: 'select-correspondence-country',
                  options: countries(),
                  className: 'w-100 w-md-50',
                })}
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExecutorApplicantInfo;
