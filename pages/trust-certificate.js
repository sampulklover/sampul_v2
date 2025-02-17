import Footer from '../components/Footer';
import TrustCertCard from '../components/TrustCertCard';
import WillActionButtons from '../components/WillActionButtons';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const TrustCertificate = () => {
  const { tempData, setValueTempData } = useTempData();

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">Trust Certificate</div>
          </div>
          <div class="col text-md-end text-center mt-md-0 mt-3"></div>
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
            <TrustCertCard trustData={tempData.trust.selectedItem} />
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
    <div class="body-01 p-5">
      <div class="content">
        <div class="mt-4">{title()}</div>
        {tabSection()}
      </div>
      <Footer />
    </div>
  );
};

export default TrustCertificate;
