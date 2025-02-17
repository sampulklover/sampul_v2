import { addUserImg, emptyUserImg } from '../constant/element';
import { belovedInviteStatus } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

const TrustCareInfo = ({ onSubmitToggle = false, onSuccess = () => {} }) => {
  const { contextApiData, getProfile, getWill } = useApi();
  const { locale, changeLocale } = useLocale();
  const { tempData, setValueTempData } = useTempData();
  const { isModalOpen, toggleModal } = useModal();
  const [selectedItems, setSelectedItems] = useState([]);
  var coSampulData = [];

  const setBelovedModal = (item, category) => {
    setValueTempData('beloved', {
      ...tempData.invite,
      key: item ? 'edit' : 'add',
      category: category ? category : 'co_sampul',
      selectedItem: item ? item : null,
    });
    toggleModal('beloved');
  };

  const handleCheckboxChange = (item) => (e) => {
    if (e.target.checked) {
      // Add item to selected items
      setSelectedItems((prev) => [...prev, item]);
    } else {
      // Remove item from selected items
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id)
      );
    }
  };

  const onSubmitForm = async () => {
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const formRef = useRef(null);

  const submitFormProgrammatically = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (onSubmitToggle) {
      submitFormProgrammatically();
    }
  }, [onSubmitToggle]);

  const loadingTable = ({ condition }) => {
    if (condition == false) {
      return (
        <div class="my-3 text-center">
          <Loading loading={true} />
        </div>
      );
    }

    return '';
  };

  return (
    <div>
      <span
        onClick={() => {
          submitFormProgrammatically();
        }}
      ></span>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        <div className="d-flex justify-content-center align-items-center">
          {loadingTable({ condition: !contextApiData.beloved.isLoading })}
          <div class="card">
            <small class="text-muted mb-3">
              Use the Trust Fund to cover my essentials: maintenance, medical
              bills, caretaker support, household expenses, or any other
              personal needs, wherever I am (Malaysia or abroad). Please ensure
              all necessary documents are provided. Alternatively, distribute
              funds directly to my caretaker:
            </small>
            {contextApiData.beloved.data?.map((item, index) => {
              if (item.type == 'future_owner') {
                var status_invites = null;
                if (item.beloved_invites.length > 0) {
                  status_invites = belovedInviteStatus().find(
                    (x) => x.value === item.beloved_invites[0].invite_status
                  );
                }

                const imageUrl = item.image_path
                  ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                  : emptyUserImg;

                return (
                  <tr key={index}>
                    <div class="d-flex flex-wrap py-3 ps-3 px-3">
                      <div className="pe-3 d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (selected) => selected.id === item.id
                          )}
                          onChange={handleCheckboxChange(item)}
                        />
                      </div>

                      <div class="dp-image-wrapper">
                        <img
                          loading="lazy"
                          src={imageUrl}
                          alt=""
                          class="dp-image"
                        />
                      </div>
                      <div class="flex-grow-1">
                        <div
                          class="smpl_text-sm-semibold crop-text"
                          onClick={() => {
                            setBelovedModal(item, 'future_owner');
                          }}
                        >
                          <span>{item.name}</span>
                        </div>
                        <div class="smpl_text-sm-regular crop-text">
                          <span>{item?.email ? item.email : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </tr>
                );
              }
            })}
            <button
              type="button"
              class="btn btn-light btn-text w-100"
              onClick={() => {
                setBelovedModal(null, 'future_owner');
              }}
            >
              <Image
                src={'images/plus-324.svg'}
                alt="image"
                width={24}
                height={24}
              />
              <span class="ms-2">Add Beneficiary</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustCareInfo;
