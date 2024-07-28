import { bodiesCategory } from '../constant/enum';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import BodyDetailsModal from './BodyDetailsModal';
import Loading from './Laoding';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';

const ManageBodies = ({ summary, refreshFunction }) => {
  const { locale } = useLocale();

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
      toast.error(translations[locale].global.something_went_wrong_);
    }
  };

  const columns = [
    {
      name: (
        <small class="smpl_text-xs-medium">
          {translations[locale].component.manage_bodies.body_service_platform}
        </small>
      ),
      selector: (item) => {
        let category = bodiesCategory().find((x) => x.value === item.category);

        const categoryName = category?.name || '';

        return (
          <td
            onClick={() => {
              openBodyModal(item);
            }}
          >
            <div class="custom-table-cell pointer-on-hover">
              <img
                loading="lazy"
                src={
                  item?.icon
                    ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                    : '/images/Displacement-p-500.png'
                }
                alt=""
                class="avatar-8"
              />
              <div>
                <div class="smpl_text-sm-medium crop-text">{item.name}</div>
                <div class="smpl_text-sm-regular crop-text">{categoryName}</div>
              </div>
            </div>
          </td>
        );
      },
    },
    {
      name: (
        <small class="smpl_text-xs-medium">
          {translations[locale].component.manage_bodies.active}
        </small>
      ),
      selector: (item) => {
        return (
          <td>
            <div class="custom-table-cell">
              <div class="smpl_text-sm-regular crop-text">
                {item.active
                  ? translations[locale].component.manage_bodies.yes
                  : translations[locale].component.manage_bodies.no}
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
      <BodyDetailsModal
        selectedBody={selectedBody.bodyDetails}
        refreshFunction={refreshFunction}
      />
      <div class="row">
        <div class="col-lg"></div>
        <div class="col text-end mt-md-0 mt-3">
          <button
            class="btn btn-primary btn-text"
            onClick={() => {
              $('#body-details-modal')?.modal('show');
              setSelectedBody({
                ...selectedBody,
                bodyDetails: null,
              });
            }}
          >
            <span>
              {translations[locale].component.manage_bodies.create_new}
            </span>
          </button>
        </div>
      </div>
      <DataTable columns={columns} data={summary.data?.bodies} pagination />
    </div>
  );
};

export default ManageBodies;

// The summary of this page includes:
// This page is designed to manage and display information about different "bodies" or service platforms.
// It includes features like a modal for detailed body information, a loading indicator, and a data table for displaying body details.
// Users can click on items in the table to view more information in a modal window.
// The component allows for creating new entries and updates its display based on the provided data.
