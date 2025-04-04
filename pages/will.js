import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import WillActionButtons from '../components/WillActionButtons';
import WillCertCard from '../components/WillCertCard';
import WillDetailsCard from '../components/WillDetailsCard';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { formatTimestamp } from '../utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Will = () => {
  const { contextApiData, getDiditAuth, getDiditSession } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();

  const summary = {
    data: {
      will: contextApiData.will.data,
      beloved: contextApiData.beloved.data,
      digitalAssets: contextApiData.digitalAssets.data,
      extraWishes: contextApiData.extraWishes.data,
      bodies: contextApiData.bodies.data,
    },
  };

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              {translations[locale].will.review_your_draft_}
            </div>

            <div class="smpl_text-md-regular">
              {summary.data.will?.last_updated
                ? `${
                    translations[locale].will.last_wasiat_will_
                  } ${formatTimestamp(summary.data.will?.last_updated)}`
                : ''}
            </div>
          </div>
          <div class="col text-md-end text-center mt-md-0 mt-3">
            <WillActionButtons viewOnly={false} />
          </div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const belovedData = contextApiData.beloved.data;

  const belovedCat = {
    primary_co_sampul: {
      data: belovedData.find(
        (b) => b.level === 'primary' && b.type === 'co_sampul'
      ),
      name: 'Primary Co-Sampul',
      translationKey: 'primary_co_sampul',
      isRequired: true,
      inviteStatus: belovedData.find(
        (b) => b.level === 'primary' && b.type === 'co_sampul'
      )?.beloved_invites[0]?.invite_status,
    },
    secondary_co_sampul: {
      data: belovedData.find(
        (b) => b.level === 'secondary' && b.type === 'co_sampul'
      ),
      name: 'Secondary Co-Sampul',
      translationKey: 'secondary_co_sampul',
      isRequired: true,
      inviteStatus: belovedData.find(
        (b) => b.level === 'secondary' && b.type === 'co_sampul'
      )?.beloved_invites[0]?.invite_status,
    },
    primary_guardian: {
      data: belovedData.find(
        (b) => b.level === 'primary' && b.type === 'guardian'
      ),
      name: 'Primary Guardian',
      isRequired: false,
    },
    secondary_guardian: {
      data: belovedData.find(
        (b) => b.level === 'secondary' && b.type === 'guardian'
      ),
      name: 'Secondary Guardian',
      isRequired: false,
    },
  };

  const displayStatusInfo = {
    pending: (
      <span>
        {translations[locale].will.is_still}{' '}
        <b>{translations[locale].will.pending}</b>
      </span>
    ),
    rejected: (
      <span>
        {translations[locale].will.has_been}{' '}
        <b>{translations[locale].will.rejected}</b>
      </span>
    ),
    null: (
      <span>
        {translations[locale].will.is_still}{' '}
        <b>{translations[locale].will.pending}</b>
      </span>
    ),
  };

  const disyplayInfo = () => {
    const alerts = [];

    Object.keys(belovedCat).forEach((category) => {
      if (!belovedCat[category].data && belovedCat[category].isRequired) {
        alerts.push(
          <div key={category} className="alert alert-danger" role="alert">
            {`${belovedCat[category].name} ${translations[locale].will.has_not_been_} `}
            <Link href="beloved" class="alert-link">
              {translations[locale].will.here}
            </Link>
            {` ${translations[locale].will.to_assign}`}
          </div>
        );
      }

      if (
        belovedCat[category].data &&
        belovedCat[category].isRequired &&
        belovedCat[category].inviteStatus !== 'accepted'
      ) {
        alerts.push(
          <div key={category} className="alert alert-danger" role="alert">
            {`${translations[locale].will.your_request_for} `}
            <b>{belovedCat[category].data.name}</b>{' '}
            {`${translations[locale].will.s_approval_to_} ${
              translations[locale].global[belovedCat[category].translationKey]
            } `}{' '}
            {displayStatusInfo[belovedCat[category].inviteStatus]}.
          </div>
        );
      }
    });
    return alerts;
  };

  const tabSection = () => {
    return (
      <>
        {disyplayInfo().map((alert, index) => (
          <div key={index}>{alert}</div>
        ))}
        <ul
          class="nav nav-pills justify-content-center tab-background mt-3"
          id="pills-tab"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <button
              class="nav-link smpl_text-sm-semibold active"
              id="pills-certificate-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-certificate"
              type="button"
              role="tab"
              aria-controls="pills-certificate"
              aria-selected="true"
            >
              {translations[locale].will.certificate}
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link smpl_text-sm-semibold"
              id="pills-details-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-details"
              type="button"
              role="tab"
              aria-controls="pills-details"
              aria-selected="false"
            >
              {translations[locale].will.details}
            </button>
          </li>
        </ul>
        <div
          class="tab-content mt-5"
          id="pills-tabContent"
          style={{ 'min-height': 300 }}
        >
          <div
            class="tab-pane fade show active"
            id="pills-certificate"
            role="tabpanel"
            aria-labelledby="pills-certificate-tab"
          >
            <WillCertCard
              willData={{
                data: {
                  will: contextApiData.will.data,
                  beloved: contextApiData.beloved.data,
                  digitalAssets: contextApiData.digitalAssets.data,
                  extraWishes: contextApiData.extraWishes.data,
                  bodies: contextApiData.bodies.data,
                },
              }}
            />
          </div>
          <div
            class="tab-pane fade"
            id="pills-details"
            role="tabpanel"
            aria-labelledby="pills-details-tab"
          >
            <WillDetailsCard />
          </div>
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb pageName={translations[locale].will.wasiat_will} />
          <div class="mt-4">{title()}</div>
          {tabSection()}
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Will;

// The summary of this page includes:
// This page serves as a comprehensive platform for users to assess and manage their will-related information.
// Users are alerted to essential tasks such as assigning primary and secondary co-sampuls and guardians through clear alerts.
// These alerts also indicate the status of approval requests, whether accepted or pending.
// The page further organizes information into tabbed sections:
// the "Certificate" tab displays critical details of the will, while the "Details" tab offers more comprehensive information.
