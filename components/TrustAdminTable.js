import { bodiesCategory } from '../constant/enum';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import BodyDetailsModal from './BodyDetailsModal';
import Loading from './Laoding';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';

const ManageTrust = ({ summary, refreshFunction }) => {
  const { locale } = useLocale();

  // Function to trigger the download
  const downloadData = (data, filename, format = 'json') => {
    let dataStr;

    if (format === 'json') {
      dataStr = JSON.stringify(data, null, 2); // Use null, 2 for pretty formatting
    } else if (format === 'csv') {
      // Implement CSV conversion logic here (see example below)
      dataStr = convertToCSV(data);
    } else {
      console.error('Unsupported format:', format);
      return;
    }

    const blob = new Blob([dataStr], {
      type: `text/${format === 'json' ? 'json' : 'csv'}`,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename + `.${format}`;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Release resource
  };

  // Helper function to convert JSON data to CSV format
  const convertToCSV = (data) => {
    if (!data || typeof data !== 'object') {
      return '';
    }

    const headers = Object.keys(data);
    const csvRows = [];

    // Add headers to CSV
    csvRows.push(headers.join(','));

    // Add values to CSV
    const values = headers.map((header) => data[header]);
    csvRows.push(values.join(','));

    return csvRows.join('\n');
  };

  const columns = [
    {
      name: <small class="smpl_text-xs-medium">Trust</small>,
      selector: (item) => (
        <td>
          <div class="custom-table-cell pointer-on-hover">
            <div>
              <div class="smpl_text-sm-medium crop-text">{item.name}</div>
              <div class="smpl_text-sm-regular crop-text">
                {item.trust_code}
              </div>
            </div>
          </div>
        </td>
      ),
    },
    {
      name: <small class="smpl_text-xs-medium">Beneficiary</small>,
      selector: (item) => (
        <td>
          <div class="custom-table-cell">
            <div class="smpl_text-sm-regular crop-text">
              {item.trust_beneficiary.length}
            </div>
          </div>
        </td>
      ),
    },
    {
      name: <small class="smpl_text-xs-medium">Charity</small>,
      selector: (item) => (
        <td>
          <div class="custom-table-cell">
            <div class="smpl_text-sm-regular crop-text">
              {item.trust_charity.length}
            </div>
          </div>
        </td>
      ),
    },
    {
      name: <small class="smpl_text-xs-medium">Receipt</small>,
      selector: (item) => {
        const receiptImage = `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.trust_payment?.image_path}`;

        return (
          <td>
            <div class="custom-table-cell">
              <div class="smpl_text-sm-regular crop-text">
                {item.trust_payment?.image_path ? (
                  <a href={receiptImage} target="_blank" class="text-primary">
                    View
                  </a>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </td>
        );
      },
    },
    {
      name: <small class="smpl_text-xs-medium">Action</small>,
      selector: (item) => (
        <td>
          <div class="custom-table-cell">
            <div
              class="smpl_text-sm-regular crop-text text-primary pointer-on-hover"
              onClick={() => downloadData(item, item.trust_code, 'csv')} // Or 'json'
            >
              Download
            </div>
          </div>
        </td>
      ),
    },
  ];

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <DataTable columns={columns} data={summary.data?.trust} pagination />
    </div>
  );
};

export default ManageTrust;
