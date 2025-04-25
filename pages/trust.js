import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import PaymentStatusModal from '../components/PaymentStatusModal';
import SideBar from '../components/SideBar';
import TrustSummaryCard from '../components/TrustSummaryCard';
import TrustTable from '../components/TrustTable';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Trust = () => {
  const { contextApiData, getAllTrust } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (contextApiData.profile.data) {
      // Make sure getAllTrust includes payment history in the response
      getAllTrust();
    }
  }, [contextApiData.profile.data]);

  useEffect(() => {
    const { payment } = router.query;
    if (payment === 'success' || payment === 'failed') {
      setPaymentStatus(payment);
      // Refresh trust data after successful payment
      if (payment === 'success') {
        getAllTrust();
      }
    }
  }, [router.query]);

  const handleClosePaymentModal = () => {
    setPaymentStatus(null);
    // Remove query parameters
    router.replace('/trust', undefined, { shallow: true });
  };

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              {translations[locale].trust.trust_account_dashboard}
            </div>
            <div class="smpl_text-md-regular">
              {translations[locale].trust.monitor_and_manage}
            </div>
          </div>
          <div class="col text-end">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                toggleModal('trust');
              }}
            >
              <div class="d-flex">
                <Image
                  src={'images/plus.svg'}
                  alt="image"
                  width={24}
                  height={24}
                />
                <span class="ms-2">
                  {translations[locale].trust.create_new_trust}
                </span>
              </div>
            </button>
          </div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb
            pageName={translations[locale].component.side_bar.trust}
          />
          <div class="mt-4">{title()}</div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <TrustSummaryCard />
          </div>
          <div class="card mt-3">
            <TrustTable typeName={'trust'} />
          </div>
        </div>
        <Footer />
      </div>
      <PaymentStatusModal
        isOpen={!!paymentStatus}
        status={paymentStatus}
        onClose={handleClosePaymentModal}
      />
    </SideBar>
  );
};

export default Trust;
