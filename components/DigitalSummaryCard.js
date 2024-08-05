import { emptyUserImg } from '../constant/element';
import {
  instructionsAfterDeath,
  relationships,
  servicePlatformAccountTypes,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DigitalSummaryCard = ({
  typeName,
  showBeloved = false,
  showAll = true,
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { contextApiData } = useApi();

  const type = {
    digital: {
      title:
        translations[locale].component.digital_summary_card
          .no_digital_assets_found,
      subtitle:
        translations[locale].component.digital_summary_card
          .accounts_where_you_keep_,
      addNewBtnTitle:
        translations[locale].component.digital_summary_card.add_digital_asset,
      data: contextApiData.digitalAssets.data?.filter(
        (x) => x.account_type === 'non_subscription'
      ),
      isReady: !contextApiData.digitalAssets.isLoading,
    },
    subscription: {
      title:
        translations[locale].component.digital_summary_card.digital_expenses,
      subtitle:
        translations[locale].component.digital_summary_card
          .account_where_you_make_,
      addNewBtnTitle:
        translations[locale].component.digital_summary_card
          .add_digital_expenses,
      data: contextApiData.digitalAssets.data?.filter(
        (x) => x.account_type === 'subscription'
      ),
      isReady: !contextApiData.digitalAssets.isLoading,
    },
    all: {
      title: translations[locale].component.digital_summary_card.digital_assets,
      subtitle:
        translations[locale].component.digital_summary_card
          .accounts_where_you_keep_,
      addNewBtnTitle:
        translations[locale].component.digital_summary_card.add_digital_asset,
      data: contextApiData.digitalAssets.data,
      isReady: !contextApiData.digitalAssets.isLoading,
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
                    <small class="smpl_text-xs-medium">
                      {
                        translations[locale].component.digital_summary_card
                          .platforms
                      }
                    </small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">
                        {
                          translations[locale].component.digital_summary_card
                            .beneficiaries
                        }
                      </small>
                    </th>
                  ) : (
                    ''
                  )}
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {
                        translations[locale].component.digital_summary_card
                          .value
                      }
                    </small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">
                        {
                          translations[locale].component.digital_summary_card
                            .type
                        }
                      </small>
                    </th>
                  ) : (
                    ''
                  )}
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {
                        translations[locale].component.digital_summary_card
                          .instructions
                      }
                    </small>
                  </th>
                  {showBeloved ? (
                    <th scope="col">
                      <small class="smpl_text-xs-medium">
                        {
                          translations[locale].component.digital_summary_card
                            .remarks
                        }
                      </small>
                    </th>
                  ) : (
                    ''
                  )}
                </tr>
              </thead>
              <tbody>
                {type[typeName].data
                  .slice(0, showAll ? type[typeName].data.length : 5)
                  .map((item, index) => {
                    const spObject = contextApiData.bodies?.data?.find(
                      (x) => x.id === item.bodies_id
                    );

                    const platform = {
                      name: item?.new_service_platform_name
                        ? item.new_service_platform_name
                        : spObject?.name,
                      website: item?.new_service_platform_name
                        ? item.new_service_platform_name
                        : spObject?.website_url,
                      icon: item?.new_service_platform_name
                        ? '/images/Displacement-p-500.png'
                        : spObject?.icon
                        ? `data:image/svg+xml,${encodeURIComponent(
                            spObject?.icon
                          )}`
                        : '/images/Displacement-p-500.png',
                    };

                    const declaredValue = item.declared_value_myr
                      ? `RM ${item.declared_value_myr.toLocaleString()}`
                      : '';

                    let instructions = instructionsAfterDeath().find(
                      (x) => x.value === item.instructions_after_death
                    );

                    const beloved = contextApiData.beloved.data?.find(
                      (x) => x.id === item?.beloved_id
                    );

                    // const relation = relationships().find(
                    //   (x) => x.value === beloved?.relationship
                    // );
                    // const relationName = relation?.name || '';

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
                              src={platform.icon}
                              alt=""
                              class="avatar-8"
                            />
                            <div>
                              <div class="smpl_text-sm-medium crop-text">
                                {platform.name}
                              </div>
                              <div class="paragraph-02 crop-text">
                                {platform.website}
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
                                  <span>{beloved?.name}</span>
                                </div>
                                <div class="smpl_text-sm-regular crop-text">
                                  <span>
                                    {beloved?.email ? beloved.email : '-'}
                                  </span>
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
                            <span class={`my-badge-${instructions?.theme}`}>
                              {instructions?.shortName}
                            </span>
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
                    <Loading
                      title={
                        translations[locale].component.digital_summary_card
                          .show_all
                      }
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      class="ms-2"
                    >
                      <path
                        d="M4.1665 10.1298H15.8332M15.8332 10.1298L9.99984 4.29651M15.8332 10.1298L9.99984 15.9632"
                        stroke="#344054"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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

// The summary of this page includes:
// This page displays digital assets information categorized by type, such as non-subscription accounts or subscription expenses, based on user data fetched from an API.
// It organizes assets into a table format showing platforms, asset values, and instructions after death.
// Optional details like beneficiaries and remarks can be included.
// If assets are present, they're listed with relevant details; otherwise, a message prompts users to add assets.
// Navigation options are provided for adding new assets or viewing all digital assets.
