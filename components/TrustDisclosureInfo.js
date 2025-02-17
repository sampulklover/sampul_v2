import { addUserImg } from '../constant/element';
import {
  countries,
  estimatedNetWorths,
  genders,
  industries,
  pepTypes,
  residentStatus,
  sourceOfWealth,
  trueFalse,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { mapViewElements, renderField } from '../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const TrustDisclosureInfo = ({
  onSubmitToggle = 0,
  onSuccess = () => {},
  trustData = {},
}) => {
  const { contextApiData, getTrust } = useApi();
  const { locale } = useLocale();
  const formRef = useRef(null);

  // State variables to control conditional rendering
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showPepForm, setShowPepForm] = useState(false);

  useEffect(() => {
    if (trustData) {
      mapViewElements({
        source: trustData,
        target: elementList().profile.elements,
        viewOnly: false,
      });
    }
  }, [trustData]);

  useEffect(() => {
    if (onSubmitToggle > 0) {
      formRef.current?.requestSubmit();
    }
  }, [onSubmitToggle]);

  const elementList = () => ({
    profile: {
      elements: {
        name: document.getElementById('input-name'),
        companyName: document.getElementById('input-company-name'), // Add other elements here
        registrationNo: document.getElementById('input-registration-no'),
        businessNature: document.getElementById('input-business-nature'),
        typePepOther: document.getElementById('input-type-pep-other'),
        sourceWealthOther: document.getElementById('input-source-wealth-other'),
      },
    },
  });

  const onSubmitForm = async () => {
    const elements = elementList().profile.elements;

    const formData = Object.fromEntries(
      Object.entries(elements)
        .map(([key, element]) => [key, element?.value])
        .filter(([_, value]) => value !== undefined && value !== '')
    );

    onSuccess(formData);
  };

  // Handler for the "involved in activity" question
  const handleInvolvedActivityChange = (event) => {
    setShowActivityForm(event.target.value === 'true'); // Show if "Yes" is selected
  };

  // Handler for the "PEP" question
  const handlePepChange = (event) => {
    setShowPepForm(event.target.value === 'true'); // Show if "Yes" is selected
  };

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
          {renderField({
            label: `Are you involved/ in the business of/ employed by the following activities/ employers that are: money changers; remittance agents; pawnbrokers; casinos; precious stones and metals dealer?`,
            id: 'select-involve-activity',
            options: trueFalse(),
            onChange: handleInvolvedActivityChange, // Add the onChange handler
          })}

          {showActivityForm && (
            <div>
              <div className="d-flex flex-column flex-md-row gap-3">
                {renderField({
                  label: 'Company Name',
                  id: 'input-company-name',
                  className: 'w-100 w-md-50',
                })}
                {renderField({
                  label: 'Registration No',
                  id: 'input-registration-no',
                  className: 'w-100 w-md-50',
                })}
              </div>
              {renderField({
                label: 'Nature of Business',
                id: 'input-business-nature',
              })}
            </div>
          )}

          {renderField({
            label: `Are you/shareholder(s)/director(s) Politically Exposed Person (PEP)/ close associate of a PEP/family member of PEP?`,
            id: 'select-associate-pep',
            options: trueFalse(),
            onChange: handlePepChange, // Add the onChange handler
          })}

          {showPepForm && (
            <div>
              <div className="d-flex flex-column flex-md-row gap-3">
                {renderField({
                  label: 'Type of Politically Exposed Person',
                  id: 'select-type-pep',
                  options: pepTypes(),
                  className: 'w-100 w-md-50',
                })}
                {renderField({
                  label: 'Other (specify)',
                  id: 'input-type-pep-other',
                  required: false,
                  className: 'w-100 w-md-50',
                })}
              </div>
              <div className="d-flex flex-column flex-md-row gap-3">
                {renderField({
                  label: 'Source of Wealth',
                  id: 'select-source-wealth',
                  options: sourceOfWealth(),
                  className: 'w-100 w-md-50',
                })}
                {renderField({
                  label: 'Other (specify)',
                  id: 'input-source-wealth-other',
                  required: false,
                  className: 'w-100 w-md-50',
                })}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TrustDisclosureInfo;
