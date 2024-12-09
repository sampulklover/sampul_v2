import { addUserImg } from '../constant/element';
import { belovedLevel, beneficiaryTypes, countries } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

const AftercareModal = () => {
  const { contextApiData, getAftercare } = useApi();
  const { locale } = useLocale();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const afterCareType = tempData.aftercare.key ? tempData.aftercare.key : 'add';

  const [formInput, setFormInput] = useState({
    task: '',
    // category: '',
  });

  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
    delete: {
      isLoading: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (isModalOpen.aftercare) {
      if (tempData.aftercare.selectedItem) {
        setFormInput({
          ...formInput,
          task: tempData.aftercare.selectedItem.task,
          // category: tempData.aftercare.selectedItem.category,
        });
      }
    }
  }, [isModalOpen.aftercare]);

  const handleClose = () => {
    toggleModal('aftercare');
    setFormInput({
      ...formInput,
      task: '',
      // category: '',
    });
    setValueTempData('aftercare', {
      ...tempData.aftercare,
      key: 'add',
      selectedItem: null,
    });
  };

  const onSubmitTask = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      submit: {
        ...buttonConfig.submit,
        isLoading: true,
      },
    });

    const addData = { ...formInput };
    let query = supabase.from('aftercare');

    try {
      if (afterCareType === 'add') {
        const { data, error } = await query
          .insert({
            uuid: contextApiData.user.data?.id,
            ...addData,
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Added');
      }

      if (afterCareType === 'edit') {
        const { data, error } = await query
          .update({
            ...addData,
          })
          .eq('id', tempData.aftercare.selectedItem.id)
          .select()
          .single();

        if (error) throw error;

        toast.success('Updated');
      }

      getAftercare();
      handleClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setButtonConfig({
        ...buttonConfig,
        submit: {
          ...buttonConfig.submit,
          isLoading: false,
        },
      });
    }
  };

  const onDeleteTask = async () => {
    if (confirm(translations[locale].global.delete_confirmation)) {
      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: true,
        },
      });

      const { data, error } = await supabase
        .from('aftercare')
        .delete()
        .eq('id', tempData.aftercare.selectedItem.id)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
      }

      if (data) {
        toast.success(translations[locale].global.successfully_deleted);
        getAftercare();
        handleClose();
      }

      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: false,
        },
      });
    }
  };

  const formContainerConfig = {
    general: (
      <div>
        <form onSubmit={onSubmitTask}>
          <div className="mb-3">
            <label htmlFor="input-task" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="input-task"
              maxLength={300}
              name="task"
              value={formInput.task}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* <div className="mb-3">
            <label htmlFor="input-category" className="form-label">
              Category
            </label>
            <select
              class="form-select"
              id="select-category"
              name="category"
              onChange={handleInputChange}
              value={formInput.category}
              required
            >
              <option value="" disabled>
                Please select
              </option>
              {[
                { value: 'others', name: 'others' },
                { value: '213', name: '13323' },
              ].map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div> */}
          <div class="d-grid gap-2 mt-5">
            <button type="submit" class="btn btn-primary btn-text">
              <Loading
                title={afterCareType == 'add' ? 'Add' : 'Update'}
                loading={buttonConfig.submit.isLoading}
              />
            </button>
            {afterCareType == 'edit' ? (
              <button
                type="button"
                class="btn btn-outline-danger btn-text"
                onClick={() => {
                  onDeleteTask();
                }}
              >
                <Loading
                  title={'Delete'}
                  loading={buttonConfig.delete.isLoading}
                />
              </button>
            ) : (
              ''
            )}
          </div>
        </form>
      </div>
    ),
  };

  const viewConfig = {
    add: {
      modalTitle: 'Add a new Step',
      body: formContainerConfig.general,
    },
    edit: {
      modalTitle: 'Edit Task',
      body: formContainerConfig.general,
    },
  };

  return (
    <Modal
      show={isModalOpen.aftercare}
      onHide={handleClose}
      class="modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">{viewConfig[afterCareType]?.modalTitle}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{viewConfig[afterCareType]?.body}</div>
      </Modal.Body>
    </Modal>
  );
};

export default AftercareModal;
