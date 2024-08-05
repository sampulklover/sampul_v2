import BelovedModal from '../components/BelovedModal';
import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import InnerHeader from '../components/InnerHeader';
import IntroModal from '../components/IntroModal';
import InviteModal from '../components/InviteModal';
import Loading from '../components/Laoding';
import ProfileModal from '../components/ProfileModal';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { formatTimestamp } from '../utils/helpers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  const [inviteModalType, setInviteModalType] = useState({
    key: 'edit',
    selectedItem: null,
    category: 'invite',
  });

  const [belovedCategory, setBelovedCategory] = useState('co_sampul');

  const inviteModal = (item, category) => {
    $('#invite-modal')?.modal('show');
    setInviteModalType({
      key: 'edit',
      selectedItem: item ? item : null,
      category: category,
    });
  };

  const checkCompleteProfile = () => {
    var is_completed = false;
    if (contextApiData.profile.data?.nric_name) {
      is_completed = true;
    } else {
      is_completed = false;
    }
    return is_completed;
  };

  useEffect(() => {
    if (contextApiData.profile.isLoading == false) {
      if (checkCompleteProfile() == false) {
        setTimeout(() => {
          $('#intro-modal')?.modal('show');
        }, 1000);
      }
    }
  }, [contextApiData.digitalAssets.isLoading]);

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
                inviteModal(item, 'invite');
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
      title: 'Add your Assets to your wasiat',
      subtitle: 'Decide what happens to your assets',
      imageUrl: 'images/featured-icon-box.svg',
      onClick: () => {
        router.push('digital-assets');
      },
    },
    {
      title: 'Add your Beloved',
      subtitle: 'Appoint the future owner of your assets',
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
              <span class="heading-04">The Sampul Care team</span>
              <p class="paragraph-02 px-3">
                Connect with Sampul Care team for end-to-end guidance and
                therapy session. Start meaningful conversations and find our
                voice while doing so.
              </p>
            </div>
          </div>
          <hr />
          <button
            type="button"
            class="btn btn-primary btn-text mx-3"
            onClick={() => {
              router.push('care');
            }}
          >
            <Loading title="Chat with us" />
          </button>
        </div>
      </div>
    );
  };

  const column2 = () => {
    return (
      <div class="card h-100">
        <span class="heading-04">Recent Assets List</span>
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
            title="Start Wasiat in minutes"
            subtitle={
              <>
                <p>
                  Last wasiat update:{' '}
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
                  <Loading title="Preview Wasiat" />
                </button>
              </>
            }
            customClass="card-plain mb-3"
            firstSectionClass="p-4"
            imageSrc="images/diamond-digital-coins.svg"
            imageStyle={{ width: '100%', height: '100%' }}
          />
          <IntroModal />
          <ProfileModal category={'profile'} />
          <BelovedModal
            keyType={'add'}
            belovedType={belovedCategory}
            selectedItem={null}
          />
          <InviteModal
            keyType={inviteModalType.key}
            category={inviteModalType.category}
            selectedItem={inviteModalType.selectedItem}
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
