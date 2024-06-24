import { emptyUserImg } from '../constant/element';
import {
  belovedLevel,
  beneficiaryTypes,
  relationships,
  userRoles,
} from '../constant/enum';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserDetailsModal = ({ selectedUser, refreshFunction, summary }) => {
  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
  });

  const getElements = () => {
    const inputElements = {
      user_details: {
        role: document.getElementById('select-user-role'),
      },
    };

    return inputElements;
  };

  const onSubmitUserDetails = async (event) => {
    event.preventDefault();

    setIsLoading({
      ...isLoading,
      update: true,
    });

    const addData = {};

    for (const key in getElements().user_details) {
      if (key !== 'image_path') {
        addData[key] = getElements().user_details[key].value;
      }
    }

    const { data, error } = await supabase
      .from('roles')
      .update({
        ...addData,
      })
      .eq('uuid', selectedUser.uuid);

    if (error) {
      setIsLoading({
        ...isLoading,
        update: false,
      });
      toast.error(error.message);
      return;
    }

    try {
      $('#user-details-modal')?.modal('hide');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }

    refreshFunction();
    toast.success('Save!');

    setIsLoading({
      ...isLoading,
      update: false,
    });
  };

  useEffect(() => {
    if (selectedUser) {
      const selectRole = getElements().user_details.role;
      selectRole.value = selectedUser.roles.role;
    }
  }, [selectedUser]);

  return (
    <div class="modal fade" id="user-details-modal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details</h5>
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
                <img
                  loading="lazy"
                  src={
                    selectedUser?.image_path
                      ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${selectedUser.image_path}`
                      : emptyUserImg
                  }
                  alt=""
                  class="avatar-8"
                />
                <div class="text-and-supporting-text-18">
                  <div class="text-lg-semibold-4">{selectedUser?.username}</div>
                  <div class="text-sm-regular-6">{selectedUser?.email}</div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>

            <form onSubmit={onSubmitUserDetails}>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label
                    htmlFor={`select-beloved-relationship`}
                    class="uui-field-label"
                  >
                    User role
                  </label>
                  <select
                    id="select-user-role"
                    required
                    class="form_input w-select"
                  >
                    {userRoles().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label class="uui-field-label">Beloved List</label>
              <div class="table-responsive" style={{ width: '100%' }}>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">
                        <small class="smpl_text-xs-medium">Beloved</small>
                      </th>

                      {/* <th scope="col">
                        <small class="smpl_text-xs-medium">Relationship</small>
                      </th> */}

                      <th scope="col">
                        <small class="smpl_text-xs-medium">Type</small>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser?.beloved.map((item, index) => {
                      const userImg = item?.image_path
                        ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                        : emptyUserImg;

                      // const rObject = relationships().find(
                      //   (x) => x.value === item.relationship
                      // );

                      const tObject = beneficiaryTypes().find(
                        (x) => x.value === item.type
                      );

                      const lObject = belovedLevel().find(
                        (x) => x.value === item.level
                      );

                      return (
                        <tr key={index}>
                          <td>
                            <div class="custom-table-cell">
                              <img
                                loading="lazy"
                                src={userImg}
                                alt=""
                                class="avatar-8"
                              />
                              <div>
                                <div class="smpl_text-sm-medium crop-text">
                                  {item.name}
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  {item.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* <td>
                            <div class="custom-table-cell">
                              <div class="smpl_text-sm-regular crop-text">
                                {rObject?.name}
                              </div>
                            </div>
                          </td> */}
                          <td>
                            <div class="custom-table-cell">
                              <div class="smpl_text-sm-regular crop-text">
                                {lObject?.name} {tObject?.name}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <label class="uui-field-label">Digital Assets List</label>

              <div class="table-responsive" style={{ width: '100%' }}>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">
                        <small class="smpl_text-xs-medium">Platforms</small>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser?.digital_assets?.map((item, index) => {
                      const bodies = summary.data?.bodies.find(
                        (x) => x.id === item.bodies_id
                      );

                      const platform = {
                        name: bodies?.name,
                        website_url: bodies?.website_url,
                        icon: bodies?.icon
                          ? `data:image/svg+xml,${encodeURIComponent(
                              bodies?.icon
                            )}`
                          : '/images/Displacement-p-500.png',
                      };

                      return (
                        <tr key={index}>
                          <td>
                            <div class="custom-table-cell">
                              <img
                                loading="lazy"
                                src={platform.icon}
                                class="avatar-8"
                              />
                              <div>
                                <div class="smpl_text-sm-medium crop-text">
                                  {platform.name}
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  {platform.website_url}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div class="d-grid gap-2 mt-5">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading title="Save" loading={isLoading.update} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

// The summary of this page includes:
// This page displays a modal component for managing detailed user information.
// It includes functionalities for updating user roles and interacting with user data stored in a database using Supabase.
// The modal presents user details such as username and email, along with roles that can be selected from a dropdown menu.
// Additionally, it lists users' "beloved" individuals and their associated types and levels.
// Digital assets linked to the user are also displayed, showing platforms and their respective details.
// The modal supports data editing and updates with visual feedback on loading states using components like toast notifications and loading spinners.
