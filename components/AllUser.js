import { emptyUserImg } from '../constant/element';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import UserDetailsModal from './UserDetailsModal';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';

const MyDetails = ({ summary, refreshFunction }) => {
  const { locale } = useLocale();

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
      toast.error(translations[locale].global.something_went_wrong_);
    }
  };

  const columns = [
    {
      name: <small class="smpl_text-xs-medium">Account</small>,
      selector: (item) => {
        const userImg = item?.image_path
          ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
          : emptyUserImg;

        return (
          <td
            onClick={() => {
              openUserModal(item);
            }}
          >
            <div class="custom-table-cell pointer-on-hover">
              <img loading="lazy" src={userImg} alt="" class="avatar-8" />
              <div>
                <div class="smpl_text-sm-medium crop-text">{item.username}</div>
                <div class="smpl_text-sm-regular crop-text">{item.email}</div>
              </div>
            </div>
          </td>
        );
      },
    },
    {
      name: (
        <small class="smpl_text-xs-medium">
          {translations[locale].component.accounts_chart.role}
        </small>
      ),
      selector: (item) => {
        return (
          <td>
            <div class="custom-table-cell">
              <div class="smpl_text-sm-regular crop-text">
                {item.roles.role}
              </div>
            </div>
          </td>
        );
      },
    },
    {
      name: (
        <small class="smpl_text-xs-medium">
          {translations[locale].component.accounts_chart.total_beloved}
        </small>
      ),
      selector: (item) => {
        return (
          <td>
            <div class="custom-table-cell">
              <div class="smpl_text-sm-regular crop-text">
                {item.beloved.length}
              </div>
            </div>
          </td>
        );
      },
    },
  ];

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <UserDetailsModal
        selectedUser={selectedUser.userDetails}
        refreshFunction={refreshFunction}
        summary={summary}
      />
      <DataTable columns={columns} data={summary.data?.profiles} pagination />
    </div>
  );
};

export default MyDetails;

// The summary of this page includes:
// This page is designed to display user details in a table format with specific columns: Account, Role, and Total Beloved.
// Each column shows different information about users, such as their username, email, role, and the number of 'beloved' items they have.
// When a user clicks on a user's account details, it opens up a modal window with more information.
// The data displayed in the table is fetched from an external source (summary.data?.profiles)
// and is paginated for easier navigation through multiple user entries.
