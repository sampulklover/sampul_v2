import {
  countries,
  genders,
  resident_status,
  residentStatus,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import { removeEmptyKeyValue, renderField } from '../utils/helpers';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

const TrustBeneficiaryInfo = ({
  onSubmitToggle = false,
  onSuccess = () => {},
}) => {
  const { contextApiData } = useApi();
  const { tempData, setValueTempData } = useTempData();
  const { locale } = useLocale();
  const [trustData, setTrustData] = useState({});
  const [beneficiaries, setBeneficiaries] = useState([
    {
      name: '',
      monthly_distribution_living: '',
      monthly_distribution_education: '',
      relationship: '',
      gender: '',
      resident_status: '',
      nationality: '',
      phone_no: '',
      email: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postcode: '',
      state_province: '',
      country: '',
      mentally_incapacitated: false,
      medical_expenses: false,
      education_expenses: false,
      settle_outstanding: false,
      invest_market: false,
      invest_unit: false,
    },
  ]);
  const formRef = useRef(null);

  useEffect(() => {
    if (contextApiData.trust.data) {
      if (contextApiData.trust.data.length > 0) {
        const foundTrust = contextApiData.trust.data.find(
          (trust) => trust.id === tempData.trust.selectedItem.id
        );

        if (foundTrust) {
          if (foundTrust?.trust_beneficiary?.length > 0) {
            const initialBeneficiaries = foundTrust.trust_beneficiary.map(
              (beneficiary) => ({
                ...beneficiary,
                mentally_incapacitated:
                  beneficiary.mentally_incapacitated || false,
                medical_expenses: beneficiary.medical_expenses || false,
                education_expenses: beneficiary.education_expenses || false,
                settle_outstanding: beneficiary.settle_outstanding || false,
                invest_market: beneficiary.invest_market || false,
                invest_unit: beneficiary.invest_unit || false,
              })
            );
            setBeneficiaries(initialBeneficiaries);
          } else {
            setBeneficiaries([]);
          }
          setTrustData(foundTrust);
        } else {
          console.log('No matching trust found.');
        }
      }
    }
  }, [contextApiData.trust.data]);

  const onSubmitForm = async () => {
    if (beneficiaries.length === 0) {
      toast.error(
        translations[locale].trust.beneficiary_info.min_one_beneficiary
      );
      return;
    }

    const updatedBeneficiaries = beneficiaries.map((beneficiary) => {
      const updatedBeneficiary = {
        ...beneficiary,
        trust_id: beneficiary.trust_id ? beneficiary.trust_id : trustData.id,
      };

      Object.keys(updatedBeneficiary).forEach((key) => {
        if (
          updatedBeneficiary[key] === null ||
          updatedBeneficiary[key] === undefined ||
          updatedBeneficiary[key] === ''
        ) {
          delete updatedBeneficiary[key];
        }
      });

      return updatedBeneficiary;
    });

    onSuccess(updatedBeneficiaries);
  };

  const submitFormProgrammatically = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (onSubmitToggle) {
      submitFormProgrammatically();
    }
  }, [onSubmitToggle]);

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: '',
        monthly_distribution_living: '',
        monthly_distribution_education: '',
        relationship: '',
        gender: '',
        resident_status: '',
        nationality: '',
        phone_no: '',
        email: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        postcode: '',
        state_province: '',
        country: '',
        mentally_incapacitated: false,
        medical_expenses: false,
        education_expenses: false,
        settle_outstanding: false,
        invest_market: false,
        invest_unit: false,
      },
    ]);
  };

  const handleDeleteBeneficiary = (index) => {
    if (beneficiaries.length <= 1) {
      toast.error(
        translations[locale].trust.beneficiary_info.min_one_beneficiary
      );
      return;
    }

    if (window.confirm('Are you sure you want to delete this beneficiary?')) {
      setBeneficiaries((prevBeneficiaries) => {
        const newBeneficiaries = [...prevBeneficiaries];
        newBeneficiaries.splice(index, 1);
        return newBeneficiaries;
      });
    }
  };

  const handleInputChange = (index, event) => {
    const { id, value } = event.target;
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index][id] = value;
    setBeneficiaries(newBeneficiaries);
  };

  const handleMentallyIncapacitatedChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].mentally_incapacitated =
      !newBeneficiaries[index].mentally_incapacitated;
    setBeneficiaries(newBeneficiaries);
  };

  const handleSettleOutstandingChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].settle_outstanding =
      !newBeneficiaries[index].settle_outstanding;
    setBeneficiaries(newBeneficiaries);
  };

  const handleMedicalExpensesChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].medical_expenses =
      !newBeneficiaries[index].medical_expenses;
    setBeneficiaries(newBeneficiaries);
  };

  const handleEducationExpensesChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].education_expenses =
      !newBeneficiaries[index].education_expenses;
    setBeneficiaries(newBeneficiaries);
  };

  const handleInvestMarketChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].invest_market =
      !newBeneficiaries[index].invest_market;
    setBeneficiaries(newBeneficiaries);
  };

  const handleInvestUnitChange = (index) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index].invest_unit = !newBeneficiaries[index].invest_unit;
    setBeneficiaries(newBeneficiaries);
  };

  const getBeneficiaryLabel = (index) => {
    switch (index) {
      case 0:
        return translations[locale].trust.beneficiary_info
          .principal_beneficiary;
      case 1:
        return translations[locale].trust.beneficiary_info
          .secondary_beneficiary;
      default:
        return translations[locale].trust.beneficiary_info
          .additional_beneficiary;
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
            {beneficiaries.map((beneficiary, index) => (
              <div key={index} className="beneficiary-item">
                {index > 0 && <hr />}
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="uui-field-label mb-3">
                    <strong>{getBeneficiaryLabel(index)}</strong>
                  </h4>
                  {index > 0 && (
                    <div onClick={() => handleDeleteBeneficiary(index)}>
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
                  label: translations[locale].trust.beneficiary_info.name,
                  id: `name-${index}`,
                  textUnder:
                    translations[locale].trust.beneficiary_info.name_as_per,
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'name', value: e.target.value },
                    }),
                  value: beneficiary.name,
                  required: true,
                })}
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info.relationship,
                    id: `relationship-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'relationship', value: e.target.value },
                      }),
                    value: beneficiary.relationship,
                  })}
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.gender,
                    id: `gender-${index}`,
                    options: genders(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'gender', value: e.target.value },
                      }),
                    value: beneficiary.gender,
                  })}
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info
                        .resident_status,
                    id: `resident-status-${index}`,
                    options: residentStatus(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: {
                          id: 'resident_status',
                          value: e.target.value,
                        },
                      }),
                    value: beneficiary.resident_status,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info.nationality,
                    id: `nationality-${index}`,
                    options: countries(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'nationality', value: e.target.value },
                      }),
                    value: beneficiary.nationality,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.phone_no,
                    id: `phone-no-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'phone_no', value: e.target.value },
                      }),
                    value: beneficiary.phone_no,
                  })}
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.email,
                    id: `email-${index}`,
                    type: 'email',
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'email', value: e.target.value },
                      }),
                    value: beneficiary.email,
                  })}
                </div>
                {renderField({
                  label:
                    translations[locale].trust.beneficiary_info.address_line_1,
                  id: `address-line-1-${index}`,
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'address_line_1', value: e.target.value },
                    }),
                  value: beneficiary.address_line_1,
                })}
                {renderField({
                  label:
                    translations[locale].trust.beneficiary_info.address_line_2,
                  id: `address-line-2-${index}`,
                  onChange: (e) =>
                    handleInputChange(index, {
                      ...e,
                      target: { id: 'address_line_2', value: e.target.value },
                    }),
                  value: beneficiary.address_line_2,
                  required: false,
                })}
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.city,
                    id: `city-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'city', value: e.target.value },
                      }),
                    value: beneficiary.city,
                  })}
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.postcode,
                    id: `postcode-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'postcode', value: e.target.value },
                      }),
                    value: beneficiary.postcode,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info
                        .state_province,
                    id: `state-province-${index}`,
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'state_province', value: e.target.value },
                      }),
                    value: beneficiary.state_province,
                  })}
                  {renderField({
                    label: translations[locale].trust.beneficiary_info.country,
                    id: `country-${index}`,
                    options: countries(),
                    className: 'w-100 w-md-50',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: { id: 'country', value: e.target.value },
                      }),
                    value: beneficiary.country,
                  })}
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info
                        .monthly_distribution_living,
                    id: `monthly-distribution-living-expenses-${index}`,
                    type: 'number',
                    className: 'w-100 w-md-50',
                    min: '0',
                    max: '100',
                    step: '0.01',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: {
                          id: 'monthly_distribution_living',
                          value: e.target.value,
                        },
                      }),
                    value: beneficiary.monthly_distribution_living,
                  })}
                  {renderField({
                    label:
                      translations[locale].trust.beneficiary_info
                        .monthly_distribution_education,
                    id: `monthly-distribution-education-expenses-${index}`,
                    type: 'number',
                    className: 'w-100 w-md-50',
                    min: '0',
                    max: '100',
                    step: '0.01',
                    onChange: (e) =>
                      handleInputChange(index, {
                        ...e,
                        target: {
                          id: 'monthly_distribution_education',
                          value: e.target.value,
                        },
                      }),
                    value: beneficiary.monthly_distribution_education,
                  })}
                </div>

                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`mentallyIncapacitatedCheckbox-${index}`}
                    checked={beneficiary.mentally_incapacitated}
                    onChange={() => handleMentallyIncapacitatedChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`mentallyIncapacitatedCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .mentally_incapacitated_info
                    }
                  </label>
                </div>

                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`settleOutstandingCheckbox-${index}`}
                    checked={beneficiary.settle_outstanding}
                    onChange={() => handleSettleOutstandingChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`settleOutstandingCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .settle_outstanding_info
                    }
                  </label>
                </div>

                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`medicalCheckbox-${index}`}
                    checked={beneficiary.medical_expenses}
                    onChange={() => handleMedicalExpensesChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`medicalCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .medical_expenses_info
                    }
                  </label>
                </div>

                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`educationCheckbox-${index}`}
                    checked={beneficiary.education_expenses}
                    onChange={() => handleEducationExpensesChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`educationCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .education_expenses_info
                    }
                  </label>
                </div>

                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`investMarketCheckbox-${index}`}
                    checked={beneficiary.invest_market}
                    onChange={() => handleInvestMarketChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`investMarketCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .invest_market_info
                    }
                  </label>
                </div>
                <div className="form-check mt-3 mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`investUnitCheckbox-${index}`}
                    checked={beneficiary.invest_unit}
                    onChange={() => handleInvestUnitChange(index)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`investUnitCheckbox-${index}`}
                  >
                    {
                      translations[locale].trust.beneficiary_info
                        .invest_unit_info
                    }
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-primary btn-text w-100"
              onClick={addBeneficiary}
            >
              <Image
                src="images/plus-324.svg"
                alt="image"
                width={24}
                height={24}
              />
              <span className="ms-2">
                {
                  translations[locale].trust.beneficiary_info
                    .add_more_beneficiary
                }
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustBeneficiaryInfo;
