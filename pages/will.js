import { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import {
  belovedLevel,
  instructionsAfterDeath,
  relationships,
  servicePlatforms,
} from '../constant/enum';
import { formatTimestamp } from '../utils/helpers';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import BelovedModal from '../components/BelovedModal';
import { addUserImg, emptyUserImg } from '../constant/element';
import WillActionButtons from '../components/WillActionButtons';
import WillCertCard from '../components/WillCertCard';
import WillDetailsCard from '../components/WillDetailsCard';
import SideBar from '../components/SideBar';

const Beloved = () => {
  const { user } = useUser();
  const cardRef = useRef(null);

  const [summary, setSummary] = useState({
    data: {
      will: null,
      beloved: [],
      digitalAssets: [],
      extraWishes: null,
      bodies: [],
    },
    isReady: false,
  });

  const [runEffect, setRunEffect] = useState(false);
  const [qrValue, setQrValue] = useState(null);

  const fetchWillData = async () => {
    const { data, error } = await supabase
      .from('wills')
      .select(`*, profiles ( * )`)
      .eq('uuid', user?.uuid);

    if (error) {
      toast.error(error.message);
    }

    if (data.length > 0) {
      return data[0];
    }
    return data;
  };

  const fetchBelovedData = async () => {
    const { data, error } = await supabase
      .from('beloved')
      .select('*')
      .eq('uuid', user?.uuid);

    if (error) {
      toast.error(error.message);
    }

    return data;
  };

  const fetchDigitalAssetsData = async () => {
    const { data, error } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('uuid', user?.uuid);

    if (error) {
      toast.error(error.message);
    }

    return data;
  };

  const fetchExtraWishesData = async () => {
    const { data, error } = await supabase
      .from('extra_wishes')
      .select('*')
      .eq('uuid', user?.uuid);

    if (error) {
      toast.error(error.message);
    }

    if (data.length > 0) {
      return data[0];
    } else {
      return null;
    }
  };

  const fetchBodiesData = async () => {
    const { data, error } = await supabase
      .from('bodies')
      .select('*')
      .eq('active', true);

    if (error) {
      toast.error(error.message);
    }

    return data;
  };

  const getWill = async () => {
    try {
      const [
        willData,
        belovedData,
        digitalAssetsData,
        extraWishesData,
        bodiesData,
      ] = await Promise.all([
        fetchWillData(),
        fetchBelovedData(),
        fetchDigitalAssetsData(),
        fetchExtraWishesData(),
        fetchBodiesData(),
      ]);

      setSummary({
        data: {
          will: willData,
          beloved: belovedData,
          digitalAssets: digitalAssetsData,
          extraWishes: extraWishesData,
          bodies: bodiesData,
        },
        isReady: true,
      });
    } catch (error) {
      setSummary({
        data: null,
        isReady: true,
      });
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      getWill();
    }
  }, [user, runEffect]);

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
            <WillActionButtons
              setQrValue={setQrValue}
              cardRef={cardRef}
              viewOnly={false}
              refreshFunction={getWill}
            />
          </div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const belovedCat = {
    primary_co_sampul: {
      data: summary.data.beloved.filter(
        (b) => b.level === 'primary' && b.type === 'co_sampul'
      ),
      name: 'Primary Co-Sampul',
      isRequired: true,
    },
    secondary_co_sampul: {
      data: summary.data.beloved.filter(
        (b) => b.level === 'secondary' && b.type === 'co_sampul'
      ),
      name: 'Secondary Co-Sampul',
      isRequired: true,
    },
    primary_guardian: {
      data: summary.data.beloved.filter(
        (b) => b.level === 'primary' && b.type === 'guardian'
      ),
      name: 'Primary Guardian',
      isRequired: false,
    },
    secondary_guardian: {
      data: summary.data.beloved.filter(
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
        belovedCat[category].data.length === 0 &&
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
        {summary.isReady ? (
          <>
            {disyplayInfo().map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
          </>
        ) : (
          <></>
        )}
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
              willData={summary.data}
              qrValue={qrValue}
              cardRef={cardRef}
            />
          </div>
          <div
            class="tab-pane fade"
            id="pills-details"
            role="tabpanel"
            aria-labelledby="pills-details-tab"
          >
            <WillDetailsCard willData={summary} />
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
