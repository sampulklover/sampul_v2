import Link from 'next/link';
import { instructionsAfterDeath, servicePlatforms } from '../constant/enum';
import Loading from './Laoding';
import { addUserImg } from '../constant/element';

const DigitalAssetsCard = ({ typeName, summary, editFunction }) => {
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
              const spObject = servicePlatforms().find(
                (x) => x.value === item.service_platform
              );

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
                            src={spObject.img}
                            class="rounded-circle"
                            alt="..."
                            width={40}
                            height={40}
                          />
                        </div>
                        <div class="col">
                          <div class="col bg-dark">
                            <div class="bg-white d-flex justify-content-md-between justify-content-center">
                              <div class="smpl_text-sm-semibold crop-text mt-md-0 mt-3">
                                <span>{spObject.name}</span>
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
                                      stroke-width="1.67"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    ></path>
                                  </svg>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div class="col mt-3">
                            <div class="d-flex justify-content-between">
                              <span>
                                <div class="physicalassets_detail-wrapper">
                                  <div class="uui-career07_icon-wrapper">
                                    <div class="button-icon w-embed">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
                                          stroke="currentColor"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
                                        <path
                                          d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
                                          stroke="currentColor"
                                          stroke-opacity="0.2"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
                                        <path
                                          d="M15 22C18.866 22 22 18.866 22 15C22 11.134 18.866 8 15 8C11.134 8 8 11.134 8 15C8 18.866 11.134 22 15 22Z"
                                          stroke="currentColor"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
                                        <path
                                          d="M15 22C18.866 22 22 18.866 22 15C22 11.134 18.866 8 15 8C11.134 8 8 11.134 8 15C8 18.866 11.134 22 15 22Z"
                                          stroke="currentColor"
                                          stroke-opacity="0.2"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
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
                                <div class="physicalassets_detail-wrapper">
                                  <div class="uui-career07_icon-wrapper">
                                    <div class="button-icon w-embed">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M6 11V15M18 9V13M17 4C19.4487 4 20.7731 4.37476 21.4321 4.66544C21.5199 4.70415 21.5638 4.72351 21.6904 4.84437C21.7663 4.91682 21.9049 5.12939 21.9405 5.22809C22 5.39274 22 5.48274 22 5.66274V16.4111C22 17.3199 22 17.7743 21.8637 18.0079C21.7251 18.2454 21.5914 18.3559 21.3319 18.4472C21.0769 18.5369 20.562 18.438 19.5322 18.2401C18.8114 18.1017 17.9565 18 17 18C14 18 11 20 7 20C4.55129 20 3.22687 19.6252 2.56788 19.3346C2.48012 19.2958 2.43624 19.2765 2.3096 19.1556C2.23369 19.0832 2.09512 18.8706 2.05947 18.7719C2 18.6073 2 18.5173 2 18.3373L2 7.58885C2 6.68009 2 6.2257 2.13628 5.99214C2.2749 5.75456 2.40859 5.64412 2.66806 5.55281C2.92314 5.46305 3.43803 5.56198 4.46783 5.75985C5.18862 5.89834 6.04348 6 7 6C10 6 13 4 17 4ZM14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
                                          stroke="currentColor"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
                                        <path
                                          d="M6 11V15M18 9V13M17 4C19.4487 4 20.7731 4.37476 21.4321 4.66544C21.5199 4.70415 21.5638 4.72351 21.6904 4.84437C21.7663 4.91682 21.9049 5.12939 21.9405 5.22809C22 5.39274 22 5.48274 22 5.66274V16.4111C22 17.3199 22 17.7743 21.8637 18.0079C21.7251 18.2454 21.5914 18.3559 21.3319 18.4472C21.0769 18.5369 20.562 18.438 19.5322 18.2401C18.8114 18.1017 17.9565 18 17 18C14 18 11 20 7 20C4.55129 20 3.22687 19.6252 2.56788 19.3346C2.48012 19.2958 2.43624 19.2765 2.3096 19.1556C2.23369 19.0832 2.09512 18.8706 2.05947 18.7719C2 18.6073 2 18.5173 2 18.3373L2 7.58885C2 6.68009 2 6.2257 2.13628 5.99214C2.2749 5.75456 2.40859 5.64412 2.66806 5.55281C2.92314 5.46305 3.43803 5.56198 4.46783 5.75985C5.18862 5.89834 6.04348 6 7 6C10 6 13 4 17 4ZM14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
                                          stroke="currentColor"
                                          stroke-opacity="0.2"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        ></path>
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <rect
                    x="5"
                    y="5"
                    width="56"
                    height="56"
                    rx="28"
                    stroke="#DDD8FB"
                    stroke-width="10"
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
