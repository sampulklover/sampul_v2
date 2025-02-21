import { donationCategories, donationDurations } from '../constant/enum';
import { useApi } from '../context/api';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

const TrustGivingInfo = ({ onSubmitToggle = false, nextStep }) => {
  const { contextApiData } = useApi();
  const { tempData, setValueTempData } = useTempData();
  const { isModalOpen, toggleModal } = useModal();
  const [selectedItems, setSelectedItems] = useState([]);
  const formRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (contextApiData.trust.data) {
      if (contextApiData.trust.data.length > 0) {
        const foundTrust = contextApiData.trust.data.find(
          (trust) => trust.id === tempData.trust.selectedItem.id
        );

        if (foundTrust) {
          if (foundTrust?.trust_charity?.length > 0) {
            setData(foundTrust?.trust_charity);
          } else {
            setData([]);
          }
        } else {
          console.log('No matching trust found.');
        }
      }
    }
  }, [contextApiData.trust.data]);

  const onEditItem = (item) => {
    setValueTempData('charity', {
      ...tempData.charity,
      key: 'edit',
      selectedItem: item,
    });

    toggleModal('charity');
  };

  const onAddItem = () => {
    setValueTempData('charity', {
      ...tempData.charity,
      key: 'add',
      selectedItem: { id: tempData.trust.selectedItem.id },
    });
    toggleModal('charity');
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    nextStep();
  };

  const submitFormProgrammatically = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (onSubmitToggle) {
      submitFormProgrammatically();
    }
  }, [onSubmitToggle]);

  const filteredData =
    selectedCategory === 'all'
      ? data
      : data.filter((item) => item.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {data.length > 0 ? (
        <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
          <button
            key="all"
            className={`btn rounded-pill ${
              selectedCategory === 'all'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {donationCategories().map((category) => (
            <button
              key={category.value}
              className={`btn rounded-pill ${
                selectedCategory === category.value
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
      <form ref={formRef} onSubmit={onSubmitForm}>
        {filteredData.map((item) => {
          const getDurationName = (value) => {
            const durations = donationDurations();
            const foundDuration = durations.find(
              (duration) => duration.value === value
            );
            return foundDuration ? foundDuration.name : '';
          };

          const getCategory = (value) => {
            const categories = donationCategories();
            const foundCategory = categories.find(
              (category) => category.value === value
            );
            return foundCategory ? foundCategory.name : '';
          };

          return (
            <div
              key={item.id}
              className={`card p-3 mb-3 ${
                selectedItems.includes(item.id) ? 'border-primary' : ''
              }`}
              style={{
                borderWidth: selectedItems.includes(item.id) ? '2px' : '1px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
              onClick={() => {
                onEditItem(item);
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-center gap-2">
                  {/* <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: 40, height: 40 }}
                /> */}
                  <h5 className="mb-0 fw-bold">{item.organization_name}</h5>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <p className="mt-2 mb-1">
                  <strong className="fs-4">RM {item.donation_amount}</strong>{' '}
                  <span className="text-muted">
                    {getDurationName(item.donation_duration)}
                  </span>
                </p>

                <span className="badge bg-light text-dark">
                  {getCategory(item.category)}
                </span>
              </div>
            </div>
          );
        })}
        <div class="text-center">
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={() => onAddItem()}
          >
            <Image
              src="images/plus-324.svg"
              alt="image"
              width={24}
              height={24}
            />
            <span className="ms-2">Add New Charity</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrustGivingInfo;
