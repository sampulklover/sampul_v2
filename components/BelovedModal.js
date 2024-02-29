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
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const type_title = {
  co_sampul: {
    title: 'Appoint your Co-Sampul',
    subtitle: `Co-Sampul is your trusted person for
      whom which all information in this
      Sampul will be passed on`,
    display_level: '',
  },
  future_owner: {
    title: 'Appoint your Beneficiary',
    subtitle: 'The future owner of your assets',
    display_level: 'none',
  },
  guardian: {
    title: 'Appoint your Guardian',
    subtitle:
      'The caretaker of your underage kids ensuring they get the best care after you and you spoused demised',
    display_level: 'none',
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

const getElements = () => {
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

  return inputElements;
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
    if (user.profile?.nric_name) {
      if (category !== 'co_sampul') {
        document.getElementById('select-beloved-level').value = 'others';
      }

      const addData = {};

      for (const key in getElements().beloved_modal) {
        if (key !== 'image_path') {
          addData[key] = getElements().beloved_modal[key].value;
        }
      }

      const { data: returnBeloved, error: errorBeloved } = await supabase
        .from('beloved')
        .insert({
          uuid: user?.uuid,
          ...addData,
        })
        .select()
        .single();

      if (errorBeloved) {
        toast.error(errorBeloved.message);
        return;
      }

      const directory = `/beloved/${returnBeloved.id}/avatar/`;
      const imageInput = document.getElementById('input-beloved-image');

      await replaceOrAddImage({
        userId: user?.uuid,
        returnData: returnBeloved,
        directory,
        imageInput,
        dataBase: 'beloved',
        isUpdateByReturnId: true,
      });

      const { data: returnInvite, error: errorInvite } = await supabase
        .from('beloved_invites')
        .insert({
          beloved_id: returnBeloved.id,
          uuid: returnBeloved.uuid,
          email: returnBeloved.email,
          invite_uuid: uuidv4(),
        })
        .select()
        .single();

      if (errorInvite) {
        toast.error(errorInvite.message);
        return;
      }

      $('#beloved-modal')?.modal('hide');
      toast.success('Successfully submitted!');

      setSelectedImage({
        data: null,
        url: addUserImg,
      });

      await sendInviteBeloveEmail({
        to_email: returnBeloved.email,
        to_nric_name: returnBeloved.nric_name,
        to_type: beneficiaryTypes().find(
          (obj) => obj.value === returnBeloved.type
        ).name,
        to_level: belovedLevel().find(
          (obj) => obj.value === returnBeloved.level
        ).name,
        from_name: user.profile.nric_name,
        invite_uuid: returnInvite.invite_uuid,
        beloved_id: returnBeloved.id,
      });

      refreshFunction();
    } else {
      toast.error(
        'Please update your profile to start adding your loved ones, which can be done in the settings page.'
      );
    }
  };

  const sendInviteBeloveEmail = async (passData) => {
    try {
      const response = await fetch('/api/beloved/email-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...passData,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to send invitation email');
        throw new Error('Failed to send invitation email');
      }

      toast.success(
        `Confirmation email has been sent to ${passData.to_email}`,
        {
          duration: 6000,
        }
      );

      const data = await response.json();

      const { error } = await supabase
        .from('beloved_invites')
        .update({
          invite_status: 'pending',
        })
        .eq('invite_uuid', passData.invite_uuid);

      if (error) {
        toast.error(error.message);
        return;
      }

      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const editBeloved = async () => {
    const addData = {};

    for (const key in getElements().beloved_modal) {
      if (key !== 'image_path') {
        addData[key] = getElements().beloved_modal[key].value;
      }
    }

    const { data: returnData, error } = await supabase
      .from('beloved')
      .update({
        ...addData,
      })
      .eq('uuid', user?.uuid)
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
      userId: user?.uuid,
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
        .eq('uuid', user?.uuid)
        .eq('id', selectedItem.id);
      if (error) {
        if (error.code === '23503') {
          toast.error(
            `The user cannot be removed as they are associated with your digital assets / inform death record. Please assign the record to someone else and try to delete again.`,
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

    const inputEmail = document.getElementById('input-beloved-email');

    if (inputEmail.value !== user.profile.email) {
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
    } else {
      toast.error('Please enter an email address other than your own');
    }
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
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                        stroke="#3118D3"
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
                <div
                  class="form-field-wrapper"
                  style={{ display: type_title[category].display_level }}
                >
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

              <div class="mt-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="checkbox-beloved"
                    required
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    You agree to our friendly{' '}
                    <Link href="policy">privacy policy.</Link>
                  </label>
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
