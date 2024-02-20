import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import {
  belovedLevel,
  beneficiaryTypes,
  relationships,
} from '../constant/enum';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { addUserImg } from '../constant/element';

const type_title = {
  co_sampul: {
    title: 'Appoint your Co-Sampul',
    subtitle: `Co-Sampul is your trusted person for
      whom which all information in this
      Sampul will be passed on. He/she must
      be 18 years old and above, will be
      responsible to ensure the proper
      managementof your assets distribution
      after your demise.`,
  },
  future_owner: {
    title: 'Appoint your Beneficiary',
    subtitle: 'The future owner of your assets',
  },
};

const belovedTypeName = {
  add: {
    key: 'add',
    button_title: 'Submit',
    allow_delete: false,
  },
  edit: {
    key: 'edit',
    button_title: 'Update',
    allow_delete: true,
  },
};

const BelovedModal = ({ keyType, category, selectedItem, refreshFunction }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
  });

  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addUserImg,
  });

  const addBeloved = async () => {
    const inputElements = {
      beloved_modal: {
        nric_name: document.getElementById('input-beloved-nric-name'),
        nric_no: document.getElementById('input-beloved-nric-no'),
        nickname: document.getElementById('input-beloved-nickname'),
        phone_no: document.getElementById('input-beloved-phone-no'),
        email: document.getElementById('input-beloved-email'),
        relationship: document.getElementById('select-beloved-relationship'),
        type: document.getElementById('select-beloved-type'),
        level: document.getElementById('select-beloved-level'),
        image_path: document.getElementById('preview-beloved-image'),
      },
    };

    const addData = {};

    for (const key in inputElements.beloved_modal) {
      if (key !== 'image_path') {
        addData[key] = inputElements.beloved_modal[key].value;
      }
    }

    const { data: returnData, error } = await supabase
      .from('beloved')
      .insert({
        uuid: user.uuid,
        ...addData,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    const directory = `/beloved/${returnData.id}/avatar/`;
    const imageInput = document.getElementById('input-beloved-image');

    await replaceOrAddImage({
      userId: user.uuid,
      returnData,
      directory,
      imageInput,
      dataBase: 'beloved',
      isUpdateByReturnId: true,
    });

    $('#beloved-modal')?.modal('hide');
    toast.success('Successfully submitted!');
    refreshFunction();

    setSelectedImage({
      data: null,
      url: addUserImg,
    });
  };

  const editBeloved = async () => {
    const inputElements = {
      beloved_modal: {
        nric_name: document.getElementById('input-beloved-nric-name'),
        nric_no: document.getElementById('input-beloved-nric-no'),
        nickname: document.getElementById('input-beloved-nickname'),
        phone_no: document.getElementById('input-beloved-phone-no'),
        email: document.getElementById('input-beloved-email'),
        relationship: document.getElementById('select-beloved-relationship'),
        type: document.getElementById('select-beloved-type'),
        level: document.getElementById('select-beloved-level'),
        image_path: document.getElementById('preview-beloved-image'),
      },
    };

    const addData = {};

    for (const key in inputElements.beloved_modal) {
      if (key !== 'image_path') {
        addData[key] = inputElements.beloved_modal[key].value;
      }
    }

    const { data: returnData, error } = await supabase
      .from('beloved')
      .update({
        ...addData,
      })
      .eq('uuid', user.uuid)
      .eq('id', selectedItem.id)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    const directory = `/beloved/${returnData.id}/avatar/`;
    const imageInput = document.getElementById('input-beloved-image');

    await replaceOrAddImage({
      userId: user.uuid,
      returnData,
      directory,
      imageInput,
      dataBase: 'beloved',
      isUpdateByReturnId: true,
    });

    $('#beloved-modal')?.modal('hide');
    toast.success('Successfully updated!');
    refreshFunction();

    setSelectedImage({
      data: null,
      url: addUserImg,
    });
  };

  const deleteBeloved = async () => {
    if (confirm(`Are you sure you want to delete this record?`)) {
      setIsLoading({
        ...isLoading,
        delete: true,
      });

      const { data, error } = await supabase
        .from('beloved')
        .delete()
        .eq('uuid', user.uuid)
        .eq('id', selectedItem.id);
      if (error) {
        if (error.code === '23503') {
          toast.error(
            `The user cannot be removed as they are associated with your digital assets. Please assign the assets to someone else and try to delete again.`,
            {
              duration: 6000,
            }
          );
        } else {
          toast.error(error.message);
        }

        setIsLoading({
          ...isLoading,
          delete: false,
        });

        return;
      }
      await deleteImage({
        returnData: selectedItem,
      });

      $('#beloved-modal')?.modal('hide');
      toast.success('Successfully deleted!');
      refreshFunction();

      setIsLoading({
        ...isLoading,
        delete: false,
      });
    }
  };

  const onSubmitAddBeloved = async (event) => {
    event.preventDefault();

    setIsLoading({
      ...isLoading,
      update: true,
    });

    if (keyType == 'add') {
      await addBeloved();
    }
    if (keyType == 'edit') {
      await editBeloved();
    }

    setIsLoading({
      ...isLoading,
      update: false,
    });
  };

  return (
    <div class="modal fade" id="beloved-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Beloved</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="modal-header-2 mb-3">
              <div class="content-32">
                <div class="smpl-icon-featured-outline-large">
                  <div class="uui-icon-1x1-xsmall-2 w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="text-and-supporting-text-18">
                  <div class="text-lg-semibold-4">
                    {type_title[category].title}
                  </div>
                  <div class="text-sm-regular-6">
                    {type_title[category].subtitle}
                  </div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>
            <form onSubmit={onSubmitAddBeloved}>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <label
                    for={`input-beloved-nric-name`}
                    class="uui-field-label"
                  >
                    Name (As Per NRIC)
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-beloved-nric-name`}
                    required
                  />
                </div>
                <div class="form-field-wrapper">
                  <label for={`input-beloved-nickname`} class="uui-field-label">
                    Nickname
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-beloved-nickname`}
                    placeholder="e.g. Along, Angah, Acik"
                    required
                  />
                </div>
              </div>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <label for={`input-beloved-nric-no`} class="uui-field-label">
                    NRIC
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-beloved-nric-no`}
                    required
                  />
                </div>
                <div class="form-field-wrapper">
                  <label for={`input-beloved-phone-no`} class="uui-field-label">
                    Phone number
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id={`input-beloved-phone-no`}
                    required
                  />
                </div>
              </div>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <label for={`input-beloved-email`} class="uui-field-label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id={`input-beloved-email`}
                    required
                  />
                </div>
                <div class="form-field-wrapper">
                  <label
                    for={`select-beloved-relationship`}
                    class="uui-field-label"
                  >
                    Relationship
                  </label>
                  <select
                    id={`select-beloved-relationship`}
                    required=""
                    class="form_input w-select"
                  >
                    {relationships().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <label for={`select-beloved-level`} class="uui-field-label">
                    Beloved level
                  </label>
                  <select
                    id={`select-beloved-level`}
                    required=""
                    class="form_input w-select"
                  >
                    {belovedLevel().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div class="form-field-wrapper" style={{ display: 'none' }}>
                  <label for={`select-beloved-type`} class="uui-field-label">
                    Beneficiary Type
                  </label>
                  <select
                    id={`select-beloved-type`}
                    required=""
                    class="form_input w-select"
                  >
                    {beneficiaryTypes().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="w-layout-grid settings_component">
                <div class="text-and-supporting-text-14">
                  <label class="uui-field-label">Profile photo</label>
                  <div class="text-size-tiny">
                    This will be displayed on profile.
                  </div>
                </div>
                <div class="avatar-and-actions">
                  <img
                    loading="lazy"
                    src={selectedImage.url}
                    alt=""
                    class="avatar-7"
                    id="preview-beloved-image"
                    onClick={() => {
                      document.getElementById('input-beloved-image').click();
                    }}
                  />
                  <input
                    type="file"
                    id="input-beloved-image"
                    name=""
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) => {
                      let imageURL = URL.createObjectURL(event.target.files[0]);
                      setSelectedImage({
                        data: event.target.files[0],
                        url: imageURL,
                      });
                    }}
                  />
                </div>
              </div>

              <div class="d-grid gap-2 mt-5">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading
                    title={belovedTypeName[keyType].button_title}
                    loading={isLoading.update}
                  />
                </button>
                {belovedTypeName[keyType].allow_delete ? (
                  <button
                    type="button"
                    class="btn btn-light btn-lg btn-text"
                    onClick={deleteBeloved}
                  >
                    <Loading title="Delete" loading={isLoading.delete} />
                  </button>
                ) : (
                  ''
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BelovedModal;
