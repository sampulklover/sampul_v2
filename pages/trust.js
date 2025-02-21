import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import TrustSummaryCard from '../components/TrustSummaryCard';
import TrustTable from '../components/TrustTable';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Trust = () => {
  const { contextApiData, getAllTrust } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();

  useEffect(() => {
    if (contextApiData.profile.data) {
      getAllTrust();
    }
  }, [contextApiData.profile.data]);

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">Trust Account Dashboard</div>
            <div class="smpl_text-md-regular">
              Monitor and manage your trust assets, beneficiaries, and
              instructions.
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
                <span class="ms-2">Create New Trust</span>
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
          <Breadcrumb pageName="Trust" />
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
    </SideBar>
  );
};

export default Trust;
