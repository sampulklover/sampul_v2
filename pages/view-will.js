import Footer from '../components/Footer';
import WillActionButtons from '../components/WillActionButtons';
import WillCertCard from '../components/WillCertCard';
import { formatTimestamp } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ViewWill = () => {
  const router = useRouter();

  const [summary, setSummary] = useState({
    data: { will: null },
    isReady: false,
  });

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
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">Wasiat/will</div>
            <div class="smpl_text-md-regular">
              {summary.data.will?.last_updated
                ? ` Last wasiat/will generated: ${formatTimestamp(
                    summary.data.will?.last_updated
                  )}`
                : ''}
            </div>
          </div>
          <div class="col text-md-end text-center mt-md-0 mt-3">
            <WillActionButtons viewOnly={true} />
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
            <WillCertCard willData={summary} />
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

export default ViewWill;

// The summary of this page includes:
// This page is designed to display details of a will based on a unique identifier ('will_code') obtained from the URL query parameters.
// Upon loading, the component initiates a fetch operation to retrieve the will's information.
// If successful, it updates the state to include the fetched data and indicates readiness for rendering.
// If the specified will ID does not exist, it triggers an error notification.
// The page layout consists of a title section displaying the last updated timestamp of the will and action buttons for viewing.
// A tabbed interface allows navigation between different sections, currently focusing on displaying the certificate related to the will.
