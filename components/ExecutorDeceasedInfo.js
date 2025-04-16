import { addUserImg } from '../constant/element';
import {
  countries,
  estimatedNetWorths,
  ethnicities,
  executorDeathCause,
  executorRelationships,
  genders,
  industries,
  maritalStatus,
  pepTypes,
  relationships,
  religions,
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

const ExecutorDeceasedInfo = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, addExecutorDeceased } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const formRef = useRef(null);
  const [hasWill, setHasWill] = useState(false);
  const t = translations[locale].executor.deceased_info;

  useEffect(() => {
    if (contextApiData.executor.data) {
      if (
        contextApiData.executor.data.length > 0 &&
        tempData.executor.selectedItem?.id
      ) {
        const foundExecutor = contextApiData.executor.data.find(
          (executor) => executor.id === tempData.executor.selectedItem.id
        );

        if (foundExecutor?.executor_deceased) {
          setHasWill(foundExecutor.executor_deceased.will_written || false);
          setTimeout(() => {
            mapViewElements({
              source: foundExecutor.executor_deceased,
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

  const handleWillWrittenChange = () => {
    setHasWill(!hasWill);
  };

  const onSubmitForm = async () => {
    const elements = elementList().profile.elements;
    const formData = removeEmptyKeyValue(elements);
    var newData = {
      executor_id: tempData.executor.selectedItem.id,
      ...formData,
      will_written: hasWill,
    };

    try {
      const result = await addExecutorDeceased({
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
        date_of_death: document.getElementById('input-date-of-death'),
        cause_of_death: document.getElementById('select-cause-of-death'),
        place_of_death: document.getElementById('input-place-of-death'),
        marital_status: document.getElementById('select-marital-status'),
        citizenship: document.getElementById('select-citizenship'),
        religion: document.getElementById('select-religion'),
        race: document.getElementById('select-race'),
        bankrupt: document.getElementById('select-bankrupt'),
        will_written: document.getElementById('select-will-written'),
        will_registration_no: document.getElementById(
          'input-will-registration-no'
        ),
        executor: document.getElementById('input-executor'),
        will_custodian: document.getElementById('input-will-custodian'),
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
            <strong>{t.particulars_of_deceased}</strong>
          </h4>

          {renderField({
            label: t.full_name,
            id: 'input-full-name',
            textUnder: t.name_as_stated,
            required: true,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.nric_new,
              id: 'input-nric-new',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.nric_old,
              id: 'input-nric-old',
              className: 'w-100 w-md-50',
              required: false,
            })}
          </div>
          {renderField({
            label: t.police_army_nric,
            id: 'input-police-army-nric',
            required: false,
          })}
          <div className="d-flex flex-column flex-md-row gap-3">
            {renderField({
              label: t.date_of_death,
              id: 'input-date-of-death',
              type: 'date',
              className: 'w-100 w-md-50',
            })}
            {renderField({
              label: t.cause_of_death,
              id: 'select-cause-of-death',
              options: executorDeathCause(),
              className: 'w-100 w-md-50',
            })}
          </div>
          {renderField({
            label: t.place_of_death,
            id: 'input-place-of-death',
          })}
          {renderField({
            label: t.marital_status,
            id: 'select-marital-status',
            options: maritalStatus(),
          })}
          {renderField({
            label: t.citizenship,
            id: 'select-citizenship',
            options: countries(),
          })}
          {renderField({
            label: t.religion,
            id: 'select-religion',
            options: religions(),
          })}
          {renderField({
            label: t.race,
            id: 'select-race',
            options: ethnicities(),
          })}
          {renderField({
            label: t.bankrupt,
            id: 'select-bankrupt',
            options: trueFalse(),
          })}
          <div className="form-check">
            <input
              type="checkbox"
              id="will-written-checkbox"
              className="form-check-input"
              checked={hasWill}
              onChange={handleWillWrittenChange}
            />
            <label htmlFor="will-written-checkbox" className="form-check-label">
              {t.will_written} ({t.will_written_desc})
            </label>
          </div>
          {hasWill && (
            <>
              <h4 className="uui-field-label mt-4">
                <strong>{t.will_info}</strong>
              </h4>
              {renderField({
                label: t.will_registration_no,
                id: 'input-will-registration-no',
              })}
              {renderField({
                label: t.executor,
                id: 'input-executor',
              })}
              {renderField({
                label: t.will_custodian,
                id: 'input-will-custodian',
              })}
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExecutorDeceasedInfo;
