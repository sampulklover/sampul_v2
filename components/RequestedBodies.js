import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const RequestedBodies = ({ summary, refreshFunction }) => {
  const { locale } = useLocale();

  const [customBodyData, setCustomBodyData] = useState([]);

  useEffect(() => {
    if (summary.data?.profiles.length > 0) {
      var tempCustomBodies = [];
      summary.data?.profiles.map((item) => {
        if (item.digital_assets.length > 0) {
          item.digital_assets.map((item2) => {
            if (item2.new_service_platform_name) {
              tempCustomBodies.push({
                username: item?.username ? item.username : '-',
                bodyName: item2.new_service_platform_name,
                bodyUrl: item2?.new_service_platform_url
                  ? item2.new_service_platform_url
                  : '-',
              });
            }
          });
        }
      });

      setCustomBodyData(tempCustomBodies);
    }
  }, [summary.data?.profiles]);

  const columns = [
    {
      name: (
        <small class="smpl_text-xs-medium">
          {translations[locale].component.manage_bodies.body_service_platform}
        </small>
      ),
      selector: (item) => {
        return (
          <td>
            <div class="custom-table-cell">
              <img
                loading="lazy"
                src="/images/Displacement-p-500.png"
                alt=""
                class="avatar-8"
              />
              <div>
                <div class="smpl_text-sm-medium crop-text">{item.bodyName}</div>
                <div class="smpl_text-sm-regular crop-text">{item.bodyUrl}</div>
              </div>
            </div>
          </td>
        );
      },
    },
    {
      name: <small class="smpl_text-xs-medium">Username</small>,
      selector: (item) => {
        return (
          <td>
            <div class="custom-table-cell">
              <div class="smpl_text-sm-regular crop-text">{item.username}</div>
            </div>
          </td>
        );
      },
    },
  ];

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <div class="row">
        <div class="col-lg"></div>
        <div class="col text-end mt-md-0 mt-3 mb-3"></div>
      </div>
      <DataTable columns={columns} data={customBodyData} pagination />
    </div>
  );
};

export default RequestedBodies;
