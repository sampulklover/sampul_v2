import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { formatTimestamp, replaceOrAddImage } from '../utils/helpers';
import Loading from './Laoding';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ExecutorTable = ({ typeName, showAll = true }) => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const { locale } = useLocale();
  const { contextApiData, deleteExecutor } = useApi();

  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
    delete: {
      isLoading: false,
    },
  });

  const type = {
    executor: {
      title: translations[locale].executor.dashboard.no_executor,
      subtitle: translations[locale].executor.dashboard.create_first,
      addNewBtnTitle: translations[locale].executor.dashboard.create_now,
      data: contextApiData.executor.data,
      isReady: !contextApiData.executor.isLoading,
    },
  };

  const deleteExecutorFunction = async (item) => {
    if (confirm(translations[locale].global.delete_confirmation)) {
      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: true,
        },
      });

      const result = await deleteExecutor({
        id: item.id,
      });

      if (result) {
        toast.success(translations[locale].global.successfully_deleted);
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

  if (type[typeName].isReady) {
    if (type[typeName].data?.length > 0 && type[typeName].isReady) {
      return (
        <>
          <div class="table-responsive" style={{ width: '100%' }}>
            <span class="heading-04">
              {translations[locale].executor.dashboard.recent_list}
            </span>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">ID</small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].executor.dashboard.created_at}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].executor.dashboard.status}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].executor.dashboard.action}
                    </small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {type[typeName].data
                  .slice(0, showAll ? type[typeName].data.length : 5)
                  .map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div class="custom-table-cell">
                            <p class="text-sm-regular-7 crop-text">
                              {item.executor_code}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div class="text-sm-regular-7 crop-text">
                              {formatTimestamp(item.created_at)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div class="badge-instructions w-inline-block">
                              <span class="text-xs-medium crop-text">
                                {
                                  translations[locale].executor.dashboard
                                    .pending
                                }
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div
                              class="text-sm-regular-8 crop-text text-primary pointer-on-hover"
                              onClick={() => {
                                toggleModal('executor');
                                setValueTempData('executor', {
                                  ...tempData.executor,
                                  key: 'edit',
                                  selectedItem: item,
                                });
                              }}
                            >
                              {translations[locale].executor.dashboard.edit}
                            </div>
                            <div
                              class="text-sm-regular-8 crop-text text-primary pointer-on-hover"
                              onClick={() => {
                                deleteExecutorFunction(item);
                              }}
                            >
                              {translations[locale].executor.dashboard.delete}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return (
      <>
        <div class="empty-data-card p-5">
          <div class="content-67">
            <div class="smpl-icon-featured-outline-large">
              <div class="icon-featured-medium w-embed">
                <svg
                  width="66"
                  height="66"
                  viewBox="0 0 66 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="56"
                    height="56"
                    rx="28"
                    fill="#F4EBFF"
                  ></rect>
                  <path
                    d="M43.5 43.5L39.4168 39.4167M42.3333 32.4167C42.3333 37.8935 37.8935 42.3333 32.4167 42.3333C26.9398 42.3333 22.5 37.8935 22.5 32.4167C22.5 26.9398 26.9398 22.5 32.4167 22.5C37.8935 22.5 42.3333 26.9398 42.3333 32.4167Z"
                    stroke="#3118D3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <rect
                    x="5"
                    y="5"
                    width="56"
                    height="56"
                    rx="28"
                    stroke="#DDD8FB"
                    strokeWidth="10"
                  ></rect>
                </svg>
              </div>
            </div>
            <div class="text-and-supporting-text-32">
              <div class="text-lg-semibold-8">{type[typeName].title}</div>
              <div class="text-sm-regular-15">{type[typeName].subtitle}</div>
            </div>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                toggleModal('executor');
              }}
            >
              <div class="d-flex">
                <Image
                  src={'images/plus.svg'}
                  alt="image"
                  width={24}
                  height={24}
                />
                <span class="ms-2">
                  {translations[locale].executor.dashboard.create_new}
                </span>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div style={{ width: '100%' }} class="d-flex justify-content-center pb-4">
      <Loading loading={true} />
    </div>
  );
};

export default ExecutorTable;
