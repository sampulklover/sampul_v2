import Breadcrumb from '../components/Breadcrumb';
import ExecutorSummaryCard from '../components/ExecutorSummaryCard';
import ExecutorTable from '../components/ExecutorTable';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import TrustSummaryCard from '../components/TrustSummaryCard';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Executor = () => {
  const { contextApiData, getAllExecutor } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();

  useEffect(() => {
    if (contextApiData.profile.data) {
      getAllExecutor();
    }
  }, [contextApiData.profile.data]);

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              {translations[locale].executor.dashboard.title}
            </div>
            <div class="smpl_text-md-regular">
              {translations[locale].executor.dashboard.subtitle}
            </div>
          </div>
          <div class="col text-end">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                toggleModal('executor');
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
                  {translations[locale].executor.dashboard.create_new}
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
            pageName={translations[locale].component.side_bar.executor}
          />
          <div class="mt-4">{title()}</div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <ExecutorSummaryCard />
          </div>
          <div class="card mt-3">
            <ExecutorTable typeName={'executor'} />
          </div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Executor;
