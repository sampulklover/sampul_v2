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
import { useRouter } from 'next/router';
import WillActionButtons from '../components/WillActionButtons';
import WillCertCard from '../components/WillCertCard';

const Beloved = () => {
  const cardRef = useRef(null);
  const router = useRouter();

  const [summary, setSummary] = useState({
    data: { will: null },
    isReady: false,
  });
  const [isReady, setIsReady] = useState(true);
  const [qrValue, setQrValue] = useState(null);

  const fetchWillData = async () => {
    const willId = router.query.id;

    if (willId) {
      const { data, error } = await supabase
        .from('wills')
        .select(`*`)
        .eq('will_code', willId);

      if (error) {
        toast.error(error.message);
      }

      if (data.length !== 0) {
        setSummary({
          data: {
            will: data[0],
          },
          isReady: true,
        });
      } else {
        toast.error(`The will with ID ${willId} does not exist!`);
      }
    } else {
      toast.error('Will Id not found!');
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setTimeout(() => {
        fetchWillData();
      }, 1000); // wait for the toast to innitiate
    }
  }, [router.isReady]);

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">Wasiat/will</div>
            </div>
            <div class="smpl_text-md-regular">
              {summary.data.will?.last_updated
                ? ` Last wasiat/will generated: ${formatTimestamp(
                    summary.data.will?.last_updated
                  )}`
                : ''}
            </div>
          </div>
          <div class="col text-end">
            <WillActionButtons
              setQrValue={setQrValue}
              cardRef={cardRef}
              viewOnly={true}
            />
          </div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const tabSection = () => {
    return (
      <>
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
          ></div>
        </div>
      </>
    );
  };

  return (
    <div class="body">
      <div class="content">
        {/* <Breadcrumb pageName={'Wasiat/Will'} /> */}
        <div class="mt-4">{title()}</div>
        {tabSection()}
      </div>
      <Footer />
    </div>
  );
};

export default Beloved;