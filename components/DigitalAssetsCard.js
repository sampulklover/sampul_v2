import Link from 'next/link';
import {
  bodiesCategory,
  instructionsAfterDeath,
  servicePlatforms,
} from '../constant/enum';
import Loading from './Laoding';
import { addUserImg } from '../constant/element';

const DigitalAssetsCard = ({
  typeName,
  summary,
  editFunction,
  bodyList = {
    data: [],
    isReady: false,
  },
}) => {
  const type = {
    all: {
      title: 'No Digital Accounts found',
      subtitle:
        'Accounts where you keep your assets with value and can be passed on to your beloved ones.',
      addNewBtnTitle: 'Add Digital Assets',
    },
    non_subscription: {
      title: 'No Digital Accounts found',
      subtitle:
        'Accounts where you keep your assets with value and can be passed on to your beloved ones.',
      addNewBtnTitle: 'Add Digital Assets',
    },
    subscription: {
      title: 'Digital Subscriptions',
      subtitle:
        'Account where you make payment for subscription and to be terminated at the point of death.',
      addNewBtnTitle: 'Add Digital Assets',
    },
  };

  if (summary.isReady) {
    if (
      summary?.data.filter(
        (item) => !typeName || item.account_type === typeName
      ).length > 0 &&
      summary.isReady
    ) {
      return (
        <>
          {summary.data
            .filter((item) => !typeName || item.account_type === typeName)
            .map((item, index) => {
              const spObject = bodyList?.data.find(
                (x) => x.value === item.bodies_id
              );

              var getCategoryName = () => {
                let category = bodiesCategory().find(
                  (x) => x.value === spObject?.details?.category
                );
                if (category?.name) {
                  return category.name;
                }
              };

              const platform = {
                category: item?.new_service_platform_name
                  ? 'Platform'
                  : getCategoryName(),
                name: item?.new_service_platform_name
                  ? item.new_service_platform_name
                  : spObject?.name,
                icon: item?.new_service_platform_name
                  ? '/images/Displacement-p-500.png'
                  : spObject?.details?.icon
                  ? `data:image/svg+xml,${encodeURIComponent(
                      spObject?.details?.icon
                    )}`
                  : '/images/Displacement-p-500.png',
              };

              const iadObject = instructionsAfterDeath().find(
                (y) => y.value === item.instructions_after_death
              );

              return (
                <div
                  key={index}
                  class="col"
                  onClick={() => {
                    editFunction(item);
                  }}
                >
                  <div>
                    <div class="card card-hover">
                      <div class="row">
                        <div class="col-md-3 text-center">
                          <img
                            src={platform.icon}
                            class="rounded-circle"
                            width={50}
                            height={50}
                          />
                        </div>
                        <div class="col">
                          <div class="col">
                            <div class="d-flex justify-content-md-between justify-content-center">
                              <div class="smpl_text-sm-semibold crop-text mt-md-0 mt-3">
                                <small class="text-primary">
                                  {platform.category}
                                </small>
                              </div>
                              <span class="d-none d-sm-block">
                                <div class="button-icon w-embed">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.83301 14.1668L14.1663 5.8335M14.1663 5.8335H5.83301M14.1663 5.8335V14.1668"
                                      stroke="CurrentColor"
                                      strokeWidth="1.67"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div class="col">
                            <h5>{platform.name}</h5>
                          </div>
                          <div class="col mt-3">
                            <div class="d-flex justify-content-between">
                              <span>
                                <div class="physicalassets_detail-wrapper">
                                  <div class="uui-career07_icon-wrapper">
                                    <div class="button-icon w-embed">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21"
                                        height="20"
                                        viewBox="0 0 21 20"
                                        fill="none"
                                      >
                                        <path
                                          d="M10.0832 4.1665H10.4452C12.9845 4.1665 14.2542 4.1665 14.7362 4.62258C15.1528 5.01681 15.3375 5.59757 15.225 6.16001C15.0948 6.81068 14.0583 7.54388 11.9851 9.01028L8.59794 11.4061C6.52476 12.8725 5.48816 13.6057 5.35803 14.2563C5.24555 14.8188 5.43018 15.3995 5.84681 15.7938C6.32878 16.2498 7.59847 16.2498 10.1378 16.2498H10.9165M7.1665 4.1665C7.1665 5.54722 6.04722 6.6665 4.6665 6.6665C3.28579 6.6665 2.1665 5.54722 2.1665 4.1665C2.1665 2.78579 3.28579 1.6665 4.6665 1.6665C6.04722 1.6665 7.1665 2.78579 7.1665 4.1665ZM18.8332 15.8332C18.8332 17.2139 17.7139 18.3332 16.3332 18.3332C14.9525 18.3332 13.8332 17.2139 13.8332 15.8332C13.8332 14.4525 14.9525 13.3332 16.3332 13.3332C17.7139 13.3332 18.8332 14.4525 18.8332 15.8332Z"
                                          stroke="#98A2B3"
                                          strokeWidth="1.33333"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <div class="smpl_text-sm-regular crop-text">
                                      <span>{iadObject.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </span>
                              <span>
                                <div class="ms-1 physicalassets_detail-wrapper">
                                  <div class="uui-career07_icon-wrapper">
                                    <div class="button-icon w-embed">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="21"
                                        height="20"
                                        viewBox="0 0 21 20"
                                        fill="none"
                                      >
                                        <path
                                          d="M5.49984 9.16683V12.5002M15.4998 7.50016V10.8335M14.6665 3.3335C16.7071 3.3335 17.8108 3.6458 18.3599 3.88803C18.4331 3.92029 18.4696 3.93642 18.5752 4.03714C18.6384 4.09751 18.7539 4.27466 18.7836 4.3569C18.8332 4.49411 18.8332 4.56911 18.8332 4.71911V13.6761C18.8332 14.4334 18.8332 14.8121 18.7196 15.0067C18.6041 15.2047 18.4927 15.2967 18.2765 15.3728C18.0639 15.4476 17.6348 15.3652 16.7766 15.2003C16.176 15.0849 15.4636 15.0002 14.6665 15.0002C12.1665 15.0002 9.6665 16.6668 6.33317 16.6668C4.29258 16.6668 3.18889 16.3545 2.63974 16.1123C2.56661 16.08 2.53004 16.0639 2.4245 15.9632C2.36124 15.9028 2.24577 15.7257 2.21606 15.6434C2.1665 15.5062 2.1665 15.4312 2.1665 15.2812L2.1665 6.32421C2.1665 5.5669 2.1665 5.18825 2.28007 4.99362C2.39559 4.79563 2.507 4.70359 2.72322 4.62751C2.93578 4.55271 3.36487 4.63515 4.22303 4.80004C4.82369 4.91545 5.53607 5.00016 6.33317 5.00016C8.83317 5.00016 11.3332 3.3335 14.6665 3.3335ZM12.5832 10.0002C12.5832 11.1508 11.6504 12.0835 10.4998 12.0835C9.34924 12.0835 8.4165 11.1508 8.4165 10.0002C8.4165 8.84957 9.34924 7.91683 10.4998 7.91683C11.6504 7.91683 12.5832 8.84957 12.5832 10.0002Z"
                                          stroke="#98A2B3"
                                          strokeWidth="1.33333"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <div class="div-block-7">
                                      <div class="smpl_text-sm-regular crop-text">
                                        <span>{`RM ${item.declared_value_myr.toLocaleString()}`}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
              <div class="text-lg-semibold-8">
                {type[typeName ? typeName : 'all'].title}
              </div>
              <div class="text-sm-regular-15">
                {type[typeName ? typeName : 'all'].subtitle}
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                editFunction(null);
              }}
            >
              <Loading
                title={type[typeName ? typeName : 'all'].addNewBtnTitle}
                loading={false}
              />
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

export default DigitalAssetsCard;
