import { useRef, useState } from 'react';
import { formatTimestamp } from '../utils/helpers';
import Link from 'next/link';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import WillActionButtons from '../components/WillActionButtons';
import WillCertCard from '../components/WillCertCard';
import WillDetailsCard from '../components/WillDetailsCard';
import SideBar from '../components/SideBar';
import { useApi } from '../context/api';

const Beloved = () => {
  const { contextApiData } = useApi();
  const cardRef = useRef(null);

  const summary = {
    data: {
      will: contextApiData.will.data,
      beloved: contextApiData.beloved.data,
      digitalAssets: contextApiData.digitalAssets.data,
      extraWishes: contextApiData.extraWishes.data,
      bodies: contextApiData.bodies.data,
    },
  };

  const [qrValue, setQrValue] = useState(null);

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              Review your draft wasiat/will
            </div>

            <div class="smpl_text-md-regular">
              {summary.data.will?.last_updated
                ? ` Last wasiat/will generated: ${formatTimestamp(
                    summary.data.will?.last_updated
                  )}`
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

  const belovedCat = {
    primary_co_sampul: {
      data: summary.data.beloved?.filter(
        (b) => b.level === 'primary' && b.type === 'co_sampul'
      ),
      name: 'Primary Co-Sampul',
      isRequired: true,
    },
    secondary_co_sampul: {
      data: summary.data.beloved?.filter(
        (b) => b.level === 'secondary' && b.type === 'co_sampul'
      ),
      name: 'Secondary Co-Sampul',
      isRequired: true,
    },
    primary_guardian: {
      data: summary.data.beloved?.filter(
        (b) => b.level === 'primary' && b.type === 'guardian'
      ),
      name: 'Primary Guardian',
      isRequired: false,
    },
    secondary_guardian: {
      data: summary.data.beloved?.filter(
        (b) => b.level === 'secondary' && b.type === 'guardian'
      ),
      name: 'secondary Guardian',
      isRequired: false,
    },
  };

  const disyplayInfo = () => {
    const alerts = [];
    Object.keys(belovedCat).forEach((category) => {
      if (
        belovedCat[category].data?.length === 0 &&
        belovedCat[category].isRequired
      ) {
        alerts.push(
          <div key={category} className="alert alert-danger" role="alert">
            {`${belovedCat[category].name} has not been assigned. Click `}
            <Link href="beloved" class="alert-link">
              here
            </Link>
            {` to assign.`}
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
              Certificate
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
              Details
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
      <div class="body inner-body">
        <div class="content">
          <Breadcrumb pageName={'Wasiat/Will'} />
          <div class="mt-4">{title()}</div>
          {tabSection()}
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Beloved;
