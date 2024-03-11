import Link from 'next/link';
import Loading from './Laoding';
import { addUserImg, emptyUserImg } from '../constant/element';
import {
  bodiesCategory,
  countries,
  maritalStatus,
  religions,
} from '../constant/enum';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  mapViewElements,
  processForm,
  replaceOrAddImage,
} from '../utils/helpers';
import toast from 'react-hot-toast';
import BodyDetailsModal from './BodyDetailsModal';

const ManageBodies = ({ summary, refreshFunction }) => {
  const [selectedBody, setSelectedBody] = useState({
    bodyDetails: null,
  });

  const openBodyModal = (item) => {
    setSelectedBody({
      ...selectedBody,
      bodyDetails: item,
    });

    try {
      $('#body-details-modal')?.modal('show');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }
  };

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <BodyDetailsModal
        selectedBody={selectedBody.bodyDetails}
        refreshFunction={refreshFunction}
      />
      <div class="table-responsive" style={{ width: '100%' }}>
        <div class="row mb-4">
          <div class="col-lg"></div>
          <div class="col text-end mt-md-0 mt-3">
            <button
              class="btn btn-primary btn-lg btn-text"
              onClick={() => {
                $('#body-details-modal')?.modal('show');
                setSelectedBody({
                  ...selectedBody,
                  bodyDetails: null,
                });
              }}
            >
              <span>Create New</span>
            </button>
          </div>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                <small class="smpl_text-xs-medium">
                  Body / Service Platform
                </small>
              </th>
              <th scope="col">
                <small class="smpl_text-xs-medium">Active</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.data.bodies.map((item, index) => {
              let category = bodiesCategory().find(
                (x) => x.value === item.category
              );

              const categoryName = category?.name || '';

              return (
                <tr
                  key={index}
                  onClick={() => {
                    openBodyModal(item);
                  }}
                >
                  <td>
                    <div class="custom-table-cell">
                      <img
                        loading="lazy"
                        src={
                          item?.icon
                            ? `data:image/svg+xml,${encodeURIComponent(
                                item.icon
                              )}`
                            : '/images/Displacement-p-500.png'
                        }
                        alt=""
                        class="avatar-8"
                      />
                      <div>
                        <div class="smpl_text-sm-medium crop-text">
                          {item.name}
                        </div>
                        <div class="smpl_text-sm-regular crop-text">
                          {categoryName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="custom-table-cell">
                      <div class="smpl_text-sm-regular crop-text">
                        {item.active ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBodies;
