import Loading from './Laoding';
import { emptyUserImg } from '../constant/element';
import { useState } from 'react';
import toast from 'react-hot-toast';
import UserDetailsModal from './UserDetailsModal';

const MyDetails = ({ summary, refreshFunction }) => {
  const [selectedUser, setSelectedUser] = useState({
    userDetails: null,
  });

  const openUserModal = (item) => {
    setSelectedUser({
      ...selectedUser,
      userDetails: item,
    });

    try {
      $('#user-details-modal')?.modal('show');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }
  };

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <UserDetailsModal
        selectedUser={selectedUser.userDetails}
        refreshFunction={refreshFunction}
        summary={summary}
      />
      <div class="table-responsive" style={{ width: '100%' }}>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                <small class="smpl_text-xs-medium">Account</small>
              </th>

              <th scope="col">
                <small class="smpl_text-xs-medium">Role</small>
              </th>

              <th scope="col">
                <small class="smpl_text-xs-medium">Total beloved</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.data?.profiles.map((item, index) => {
              const userImg = item?.image_path
                ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                : emptyUserImg;

              return (
                <tr
                  key={index}
                  onClick={() => {
                    openUserModal(item);
                  }}
                >
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
                          {item.username}
                        </div>
                        <div class="smpl_text-sm-regular crop-text">
                          {item.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="custom-table-cell">
                      <div class="smpl_text-sm-regular crop-text">
                        {item.roles.role}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="custom-table-cell">
                      <div class="smpl_text-sm-regular crop-text">
                        {item.beloved.length}
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

export default MyDetails;
