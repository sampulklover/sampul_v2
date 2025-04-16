import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import { mapViewElements } from '../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const ExecutorDeceasedAssets = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, addExecutorDeceasedAssets } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    immovable_assets: [],
    movable_assets: [],
    liabilities: [],
    beneficiaries: [],
  });

  const t = translations[locale].executor.assets_info;

  useEffect(() => {
    if (contextApiData.executor.data) {
      if (
        contextApiData.executor.data.length > 0 &&
        tempData.executor.selectedItem?.id
      ) {
        const foundExecutor = contextApiData.executor.data.find(
          (executor) => executor.id === tempData.executor.selectedItem.id
        );

        if (foundExecutor?.executor_deceased_assets) {
          setFormData({
            immovable_assets:
              foundExecutor.executor_deceased_assets.immovable_assets || [],
            movable_assets:
              foundExecutor.executor_deceased_assets.movable_assets || [],
            liabilities:
              foundExecutor.executor_deceased_assets.liabilities || [],
            beneficiaries:
              foundExecutor.executor_deceased_assets.beneficiaries || [],
          });
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

  const handleAddRow = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], {}], // Add an empty object for the new row
    }));
  };

  const handleRemoveRow = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (type, index, field, value) => {
    setFormData((prev) => {
      const updatedSection = [...prev[type]];
      updatedSection[index][field] = value;
      return { ...prev, [type]: updatedSection };
    });
  };

  const onSubmitForm = async () => {
    try {
      const updatedFormData = {
        ...formData,
        executor_id: tempData.executor.selectedItem.id,
        immovable_assets: formData.immovable_assets.map((item) => ({
          ...item,
        })),
        movable_assets: formData.movable_assets.map((item) => ({
          ...item,
        })),
        liabilities: formData.liabilities.map((item) => ({
          ...item,
        })),
        beneficiaries: formData.beneficiaries.map((item) => ({
          ...item,
        })),
      };

      const result = await addExecutorDeceasedAssets({
        data: updatedFormData,
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

  const renderFields = (type, fields) =>
    formData[type].map((item, index) => (
      <div key={index} className="d-flex flex-column flex-md-row gap-3 mb-3">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="uui-field-label">{field.label}</label>
            <input
              type="text"
              className="form-control"
              value={item[field.name] || ''}
              onChange={(e) =>
                handleInputChange(type, index, field.name, e.target.value)
              }
            />
          </div>
        ))}
        <div className="align-self-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleRemoveRow(type, index)}
          >
            Delete
          </button>
        </div>
      </div>
    ));

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
          <h4 className="uui-field-label mt-4">
            <strong>{t.immovable_assets}</strong>
            <p>{t.immovable_assets_desc}</p>
          </h4>
          {renderFields('immovable_assets', [
            { name: 'type', label: t.type },
            { name: 'title_no', label: t.title_no },
            { name: 'lot_no', label: t.lot_no },
            { name: 'area', label: t.area },
            { name: 'district', label: t.district },
            { name: 'share', label: t.share },
            { name: 'value', label: t.value },
          ])}
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={() => handleAddRow('immovable_assets')}
          >
            {t.add_immovable}
          </button>

          <h4 className="uui-field-label mt-5">
            <strong>{t.movable_assets}</strong>
            <p>{t.movable_assets_desc}</p>
          </h4>
          {renderFields('movable_assets', [
            { name: 'type', label: t.type },
            { name: 'account_no', label: t.account_no },
            { name: 'value', label: t.value },
          ])}
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={() => handleAddRow('movable_assets')}
          >
            {t.add_movable}
          </button>

          <h4 className="uui-field-label mt-5">
            <strong>{t.liabilities}</strong>
            <p>{t.liabilities_desc}</p>
          </h4>
          {renderFields('liabilities', [
            { name: 'type', label: t.type },
            { name: 'debtor', label: t.debtor },
            { name: 'value', label: t.value },
          ])}
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={() => handleAddRow('liabilities')}
          >
            {t.add_liability}
          </button>

          <h4 className="uui-field-label mt-5">
            <strong>{t.beneficiaries}</strong>
          </h4>
          {renderFields('beneficiaries', [
            { name: 'name', label: t.name },
            { name: 'nric', label: t.nric },
            { name: 'relationship', label: t.relationship },
            { name: 'phone', label: t.phone },
            { name: 'address', label: t.address },
          ])}
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={() => handleAddRow('beneficiaries')}
          >
            {t.add_beneficiary}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExecutorDeceasedAssets;
