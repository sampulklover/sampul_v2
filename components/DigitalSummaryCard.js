import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  instructionsAfterDeath,
  relationships,
  servicePlatformAccountTypes,
  servicePlatforms,
} from '../constant/enum';
import Loading from './Laoding';
import { emptyUserImg } from '../constant/element';

const DigitalSummaryCard = ({
  typeName,
  summary,
  showBeloved = false,
  belovedData = [],
}) => {
  const router = useRouter();

  const type = {
    digital: {
      title: 'No Digital Accounts found',
      subtitle:
        'Accounts where you keep your assets with value and can be passed on to your beloved ones.',
      addNewBtnTitle: 'Add Digital Accounts',
      data: summary.data?.digital_account,
      isReady: summary.isReady,
    },
    subscription: {
      title: 'Digital Subscriptions',
      subtitle:
        'Account where you make payment for subscription and to be terminated at the point of death.',
      addNewBtnTitle: 'Add Digital Subscriptions',
      data: summary.data?.subscription_account,
      isReady: summary.isReady,
    },
    all: {
      title: 'Digital Account',
      subtitle:
        'Accounts where you keep your assets with value and can be passed on to your beloved ones.',
      addNewBtnTitle: 'Add Digital Accounts',
      data: summary.data,
      isReady: summary.isReady,
    },
  };

  if (type[typeName].isReady) {
    if (type[typeName].data?.length > 0 && type[typeName].isReady) {
      return (
        <>
          <div class="table-responsive" style={{ width: '100%' }}>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">Platforms</small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">Beneficiaries</small>
                    </th>
                  ) : (
                    ''
                  )}
                  <th scope="col">
                    <small class="smpl_text-xs-medium">Value</small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">Type</small>
                    </th>
                  ) : (
                    ''
                  )}
                  <th scope="col">
                    <small class="smpl_text-xs-medium">Instructions</small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">Remarks</small>
                    </th>
                  ) : (
                    ''
                  )}
                </tr>
              </thead>
              <tbody>
                {type[typeName].data.map((item, index) => {
                  let platform = servicePlatforms().find(
                    (x) => x.value === item.service_platform
                  );

                  const platformName = platform?.name || '';
                  const platformImg = platform?.img || '';

                  const declaredValue = item.declared_value_myr
                    ? `RM ${item.declared_value_myr.toLocaleString()}`
                    : '';

                  let instructions = instructionsAfterDeath().find(
                    (x) => x.value === item.instructions_after_death
                  );

                  const instructionsName = instructions?.name || '';

                  const beloved = belovedData.find(
                    (x) => x.id === item?.beloved_id
                  );

                  const relation = relationships().find(
                    (x) => x.value === beloved?.relationship
                  );
                  const relationName = relation?.name || '';

                  const belovedImg = beloved?.image_path
                    ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${beloved.image_path}`
                    : emptyUserImg;

                  let accountType = servicePlatformAccountTypes().find(
                    (y) => y.value === item.account_type
                  );
                  const accountTypeName = accountType?.name || '';

                  return (
                    <tr key={index}>
                      <td>
                        <div class="custom-table-cell">
                          <img
                            loading="lazy"
                            src={platformImg}
                            alt=""
                            class="avatar-8"
                          />
                          <div>
                            <div class="smpl_text-sm-medium crop-text">
                              {platformName}
                            </div>
                            <div class="smpl_text-sm-regular crop-text">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {showBeloved ? (
                        <td>
                          <div class="custom-table-cell">
                            <img
                              loading="lazy"
                              src={belovedImg}
                              alt=""
                              class="dp-image"
                            />
                            <div>
                              <div class="smpl_text-sm-medium crop-text">
                                <span>{beloved?.nickname}</span>
                              </div>
                              <div class="smpl_text-sm-regular crop-text">
                                <span>{relationName}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      ) : (
                        ''
                      )}
                      <td>
                        <div class="custom-table-cell">
                          <div class="text-sm-regular-8 crop-text">
                            {declaredValue}
                          </div>
                        </div>
                      </td>
                      {showBeloved ? (
                        <td>
                          <div class="custom-table-cell">
                            <div class="badge-instructions w-inline-block">
                              <span class="text-xs-medium crop-text">
                                {accountTypeName}
                              </span>
                            </div>
                          </div>
                        </td>
                      ) : (
                        ''
                      )}
                      <td>
                        <div class="custom-table-cell">
                          <div class="badge-instructions w-inline-block">
                            <div class="html-embed-9 w-embed">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_5391_410258)">
                                  <path
                                    d="M5.24976 6.75009L10.4998 1.50009M5.31355 6.91412L6.62761 10.2931C6.74337 10.5908 6.80125 10.7396 6.88465 10.7831C6.95695 10.8208 7.04308 10.8208 7.11542 10.7832C7.19887 10.7399 7.25693 10.5911 7.37304 10.2936L10.6682 1.84969C10.773 1.5811 10.8254 1.4468 10.7968 1.36099C10.7719 1.28646 10.7134 1.22798 10.6389 1.20308C10.553 1.17441 10.4188 1.22682 10.1502 1.33164L1.70629 4.62681C1.40875 4.74292 1.25998 4.80098 1.21663 4.88443C1.17904 4.95677 1.1791 5.0429 1.21676 5.1152C1.26022 5.1986 1.40905 5.25648 1.70673 5.37224L5.08573 6.6863C5.14615 6.70979 5.17636 6.72154 5.20181 6.73969C5.22435 6.75577 5.24407 6.77549 5.26016 6.79804C5.2783 6.82348 5.29005 6.85369 5.31355 6.91412Z"
                                    stroke="#667085"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                </g>
                                <defs>
                                  <clipPath id="clip0_5391_410258">
                                    <rect
                                      width="12"
                                      height="12"
                                      fill="white"
                                    ></rect>
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <span class="text-xs-medium crop-text">
                              {instructionsName}
                            </span>
                          </div>
                        </div>
                      </td>
                      {showBeloved ? (
                        <td>
                          <div class="custom-table-cell">
                            <div class="smpl_text-sm-regular crop-text">
                              {item.remarks}
                            </div>
                          </div>
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div class="section-footer-3">
            <div class="content-35">
              <div class="actions-8">
                <Link href="digital-assets">
                  <button type="button" class="btn btn-light btn-text">
                    <Loading title="Show All" />
                  </button>
                </Link>
              </div>
            </div>
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
              <div class="text-lg-semibold-8">{type[typeName].title}</div>
              <div class="text-sm-regular-15">{type[typeName].subtitle}</div>
            </div>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                router.push('digital-assets');
              }}
            >
              <Loading title={type[typeName].addNewBtnTitle} loading={false} />
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

export default DigitalSummaryCard;
