import { countries, genders, residentStatus } from '../constant/enum';
import { renderField } from '../utils/helpers';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

const TrustCareInfo = ({ onSubmitToggle = false, onSuccess = () => {} }) => {
  const [cares, setCares] = useState([
    {
      name: '',
      percentage: 0,
      relationship: '',
      gender: '',
      residentStatus: '',
      nationality: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      state: '',
      country: '',
    },
  ]);
  const formRef = useRef(null);

  const onSubmitForm = async () => {
    if (cares.length === 0) {
      toast.error('You must have at least one care.');
      return;
    }
    onSuccess(cares);
  };

  const submitFormProgrammatically = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (onSubmitToggle) {
      submitFormProgrammatically();
    }
  }, [onSubmitToggle]);

  const addCare = () => {
    if (cares.length >= 3) {
      toast.error('You can add a maximum of 3 cares.');
      return;
    }

    setCares([
      ...cares,
      {
        name: '',
        percentage: '',
        relationship: '',
        gender: '',
        residentStatus: '',
        nationality: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        postcode: '',
        state: '',
        country: '',
      },
    ]);
  };

  const handleDeleteCare = (index) => {
    if (cares.length <= 1) {
      toast.error('You must have at least one care.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this care?')) {
      setCares((prevCares) => {
        const newCares = [...prevCares];
        newCares.splice(index, 1);
        return newCares;
      });
    }
  };

  const handleInputChange = (index, event) => {
    const { id, value } = event.target;
    const newCares = [...cares];
    newCares[index][id] = value;
    setCares(newCares);
  };

  const getCareLabel = (index) => {
    switch (index) {
      case 0:
        return 'Principal Care';
      case 1:
        return 'Secondary Care';
      default:
        return 'Additional Care';
    }
  };

  return (
    <div>
      <span onClick={submitFormProgrammatically}></span>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <div className="card w-100">
            {cares.map((care, index) => (
              <div key={index} className="care-item">
                {index > 0 && <hr />}
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="uui-field-label mb-3">
                    <strong>{getCareLabel(index)}</strong>
                  </h4>
                  {index > 0 && (
                    <div onClick={() => handleDeleteCare(index)}>
                      <Image
                        src="images/Vectors-Wrapper_13.svg"
                        alt="image"
                        width={15}
                        height={15}
                      />
                    </div>
                  )}
                </div>
                {renderField({
                  label: 'Name',
                  id: `name-${index}`,
                  textUnder: '(same as NRIC/Passport/)',
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'name', value: e.target.value },
                    }),
                  value: care.name,
                })}
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'Percentage of Distribution',
                    id: `percentage-${index}`,
                    type: 'number',
                    className: 'w-100 w-md-50',
                    min: '0',
                    max: '100',
                    step: '0.01',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'percentage', value: e.target.value },
                      }),
                    value: care.percentage,
                  })}
                  {renderField({
                    label: 'Relationship',
                    id: `relationship-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'relationship', value: e.target.value },
                      }),
                    value: care.relationship,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'Gender',
                    id: `gender-${index}`,
                    options: genders(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'gender', value: e.target.value },
                      }),
                    value: care.gender,
                  })}
                  {renderField({
                    label: 'Resident Status',
                    id: `residentStatus-${index}`,
                    options: residentStatus(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'residentStatus', value: e.target.value },
                      }),
                    value: care.residentStatus,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'Nationality',
                    id: `nationality-${index}`,
                    options: countries(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'nationality', value: e.target.value },
                      }),
                    value: care.nationality,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'Telephone/Mobile',
                    id: `phone-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'phone', value: e.target.value },
                      }),
                    value: care.phone,
                  })}
                  {renderField({
                    label: 'Email',
                    id: `email-${index}`,
                    type: 'email',
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'email', value: e.target.value },
                      }),
                    value: care.email,
                  })}
                </div>
                {renderField({
                  label: 'Address Line 1',
                  id: `address1-${index}`,
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'address1', value: e.target.value },
                    }),
                  value: care.address1,
                })}
                {renderField({
                  label: 'Address Line 2',
                  id: `address2-${index}`,
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'address2', value: e.target.value },
                    }),
                  value: care.address2,
                  required: false,
                })}
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'City',
                    id: `city-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'city', value: e.target.value },
                      }),
                    value: care.city,
                  })}
                  {renderField({
                    label: 'Postcode',
                    id: `postcode-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'postcode', value: e.target.value },
                      }),
                    value: care.postcode,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: 'State / Province',
                    id: `state-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'state', value: e.target.value },
                      }),
                    value: care.state,
                  })}
                  {renderField({
                    label: 'Country',
                    id: `country-${index}`,
                    options: countries(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'country', value: e.target.value },
                      }),
                    value: care.country,
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-light btn-text w-100"
              onClick={addCare}
            >
              <Image
                src="images/plus-324.svg"
                alt="image"
                width={24}
                height={24}
              />
              <span className="ms-2">Add More Care</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustCareInfo;
