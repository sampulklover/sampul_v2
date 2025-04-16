import BelovedModal from '../components/BelovedModal';
import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import InnerHeader from '../components/InnerHeader';
import InviteModal from '../components/InviteModal';
import Loading from '../components/Laoding';
import ProfileModal from '../components/ProfileModal';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { formatTimestamp } from '../utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();

  const [belovedCategory, setBelovedCategory] = useState('co_sampul');

  // const checkCompleteProfile = () => {
  //   var is_completed = false;
  //   if (contextApiData.profile.data?.nric_name) {
  //     is_completed = true;
  //   } else {
  //     is_completed = false;
  //   }
  //   return is_completed;
  // };

  const invitedNotification = () => {
    const alerts = [];

    contextApiData.invites.data?.map((item, index) => {
      if (item?.invite_status == 'pending') {
        alerts.push(
          <div key={index} className="alert alert-warning" role="alert">
            {translations[locale].dashboard.you_have_notification_}{' '}
            {item?.profiles?.nric_name}.{' '}
            <span
              class="pointer-on-hover"
              onClick={() => {
                setValueTempData('invite', {
                  ...tempData.invite,
                  selectedItem: item ? item : null,
                });
                toggleModal('invite');
              }}
            >
              <b>{translations[locale].dashboard.click_to_view}</b>
            </span>
          </div>
        );
      }
    });

    return alerts;
  };

  const actionButtonConfig = [
    {
      title: translations[locale].dashboard.add_your_assets_,
      subtitle: translations[locale].dashboard.decide_what_happens_,
      imageUrl: 'images/featured-icon-box.svg',
      onClick: () => {
        router.push('digital-assets');
      },
    },
    {
      title: translations[locale].dashboard.add_your_beloved,
      subtitle: translations[locale].dashboard.appoint_the_future_,
      imageUrl: 'images/user-plus-icon-box.svg',
      onClick: () => {
        router.push('beloved');
      },
    },
  ];

  const column1 = () => {
    return (
      <div>
        {actionButtonConfig.map((item, index) => {
          return (
            <div
              class="card mb-3 btn text-start"
              style={{ padding: '10px' }}
              key={index}
            >
              <div class="row" onClick={item.onClick}>
                <div class="col-auto text-center">
                  <Image
                    src={item.imageUrl}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div class="col">
                  <span class="heading-04">{item.title}</span>
                  <p class="paragraph-02 my-0">{item.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div class="card text-center px-0 py-3">
          <div>
            <div>
              <Image
                src="images/being-at-peace.svg"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '50%', height: '50%' }}
              />
            </div>
            <div class="mt-4">
              <span class="heading-04">
                {translations[locale].dashboard.the_sampul_care_}
              </span>
              <p class="paragraph-02 px-3">
                {translations[locale].dashboard.connect_with_sampul_}
              </p>
            </div>
          </div>
          <hr />
          <button
            type="button"
            class="btn btn-primary btn-text mx-3"
            onClick={() => {
              router.push('aftercare');
            }}
          >
            <Loading title={translations[locale].dashboard.chat_with_us} />
          </button>
        </div>
      </div>
    );
  };

  const column2 = () => {
    return (
      <div class="card h-100">
        <span class="heading-04">
          {translations[locale].dashboard.recent_assets_list}
        </span>
        <div class="card p-0 border-0 pt-1 mt-3">
          <DigitalSummaryCard typeName="all" showAll={false} />
        </div>
      </div>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb pageName={translations[locale].dashboard.pageTitle} />
          <InnerHeader
            title={translations[locale].dashboard.start_wasiat_in_}
            subtitle={
              <>
                <p>
                  {translations[locale].dashboard.last_wasiat_update}{' '}
                  {contextApiData.will.data?.last_updated
                    ? formatTimestamp(contextApiData.will.data?.last_updated)
                    : '-'}
                </p>
                <button
                  type="button"
                  class="btn btn-primary btn-text"
                  onClick={() => {
                    router.push('will');
                  }}
                >
                  <Loading
                    title={translations[locale].dashboard.preview_wasiat}
                  />
                </button>
              </>
            }
            customClass="card-plain mb-3"
            firstSectionClass="p-4"
            imageSrc="images/diamond-digital-coins.svg"
            imageStyle={{ width: '100%', height: '100%' }}
          />
          <ProfileModal category={'profile'} />
          <BelovedModal
            keyType={'add'}
            belovedType={belovedCategory}
            selectedItem={null}
          />
          <DigitalAssetsModal keyType={'add'} selectedItem={null} />
          {invitedNotification()}
          <div class="row">
            <div class="col-lg">{column1()}</div>
            <div class="col mt-3 mt-md-0">{column2()}</div>
          </div>
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default Dashboard;
