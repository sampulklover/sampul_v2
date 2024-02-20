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
                  <div class="card digitalassets_item">
                    <div class="row">
                      <div class="col-2">
                        <img
                          src={spObject.img}
                          class="rounded-circle"
                          alt="..."
                          width={40}
                          height={40}
                        />
                      </div>
                      <div class="col">
                        <span class="smpl_text-sm-semibold">
                          {spObject.name}
                        </span>
                        <div class="row">
                          <div class="col">
                            <span class="smpl_text-sm-regular">
                              {iadObject.name}
                            </span>
                          </div>
                          <div class="col">
                            <span class="smpl_text-sm-regular">{`RM ${item.declared_value_myr}`}</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-1 align-self-start">
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
