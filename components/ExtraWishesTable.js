import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ExtraWishesTable = ({ typeName }) => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const [bodyList, setBodyList] = useState([]);

  const mapWithBodies = () => {
    const allData = [];

    contextApiData.bodies.data.map((item) => {
      contextApiData.extraWishes.data?.charity_bodies?.map((item2) => {
        if (item.id == item2.bodies_id) {
          allData.push({ category: 'Charity', ...item2, bodyData: item });
        }
      });
      contextApiData.extraWishes.data?.waqf_bodies?.map((item2) => {
        if (item.id == item2.bodies_id) {
          allData.push({ category: 'Waqf', ...item2, bodyData: item });
        }
      });
    });

    setBodyList(allData);
  };

  useEffect(() => {
    if (
      contextApiData.extraWishes.data !== null &&
      contextApiData.bodies.data.length > 0
    ) {
      mapWithBodies();
    }
  }, [contextApiData.extraWishes, contextApiData.bodies]);

  const type = {
    extra_wishes: {
      title: translations[locale].component.extra_wishes_table.extra_wishes,
      subtitle:
        translations[locale].component.extra_wishes_table.add_special_touches_,
      addNewBtnTitle:
        translations[locale].component.extra_wishes_table.add_extra_wishes,
      data: bodyList,
      isReady: true,
      pageName: 'extra-wishes',
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
                        translations[locale].component.extra_wishes_table
                          .institution
                      }
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].component.extra_wishes_table.value}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].component.extra_wishes_table.type}
                    </small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {type[typeName].data.map((item, index) => {
                  const platform = {
                    name: item?.bodyData?.name,
                    website: item?.bodyData?.website_url,
                    icon: item?.bodyData?.icon
                      ? `data:image/svg+xml,${encodeURIComponent(
                          item.bodyData.icon
                        )}`
                      : '/images/Displacement-p-500.png',
                    value: `RM ${Number(item.amount).toLocaleString()}`,
                    category: item.category,
                  };

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
                            <Link
                              class="smpl_text-sm-regular crop-text"
                              href={platform.website}
                              target="_blank"
                            >
                              {platform.website}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="custom-table-cell">
                          <div class="text-sm-regular-8 crop-text">
                            {platform.value}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="custom-table-cell">
                          <div class="badge-instructions w-inline-block">
                            <span class="text-xs-medium crop-text">
                              {platform.category}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div class="section-footer-3">
            <div class="content-35">
              <div class="actions-8">
                <Link href={type[typeName].pageName}>
                  <button type="button" class="btn btn-light btn-text">
                    <Loading title="Show All" />
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
                router.push(type[typeName].pageName);
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

export default ExtraWishesTable;

// The summary of this page includes:
// The purpose of this page is to display a table of extra wishes categorized as either Charity or Waqf.
// It fetches data from an API through a custom hook and renders details about each wish,
// including the institution's name, value, and type.
// If data is available, it dynamically generates rows in the table with icons, links, and category badges.
// Users can click to view more details or add new wishes.
// If no data is present, it offers a prompt to add new wishes.
