import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  belovedLevel,
  instructionsAfterDeath,
  relationships,
  servicePlatforms,
} from '../constant/enum';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import BelovedModal from '../components/BelovedModal';
import { addUserImg, emptyUserImg } from '../constant/element';
import MyDetails from '../components/MyDetails';
import Password from '../components/Password';
import InformDeath from '../components/InformDeath';
import Billing from '../components/Billing';
import SideBar from '../components/SideBar';

const Settings = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && document) {
      setTimeout(() => {
        const activeTab = router.query.tab;

        if (activeTab) {
          const tab = document.getElementById(activeTab);
          if (tab) {
            tab.click();
          }
        }
      }, 500);
    }
  }, [router.isReady]);

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">Settings</div>
            </div>
            <div class="smpl_text-md-regular">
              Manage your account settings here
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        {/* <div class="border-top my-3"></div> */}
      </>
    );
  };

  const tabSection = () => {
    return (
      <div class="project-tab">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              class="nav-link active"
              id="nav-my-details-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-my-details"
              type="button"
              role="tab"
              aria-controls="nav-my-details"
              aria-selected="true"
            >
              My details
            </button>
            <button
              class="nav-link"
              id="nav-password-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-password"
              type="button"
              role="tab"
              aria-controls="nav-password"
              aria-selected="false"
            >
              Password
            </button>
            <button
              class="nav-link"
              id="nav-inform-death-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-inform-death"
              type="button"
              role="tab"
              aria-controls="nav-inform-death"
              aria-selected="false"
            >
              Inform Death
            </button>
            <button
              class="nav-link"
              id="nav-billing-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-billing"
              type="button"
              role="tab"
              aria-controls="nav-billing"
              aria-selected="false"
            >
              Billing
            </button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-my-details"
            role="tabpanel"
            aria-labelledby="nav-my-details-tab"
          >
            <MyDetails />
          </div>
          <div
            class="tab-pane fade"
            id="nav-password"
            role="tabpanel"
            aria-labelledby="nav-password-tab"
          >
            <Password />
          </div>
          <div
            class="tab-pane fade"
            id="nav-inform-death"
            role="tabpanel"
            aria-labelledby="nav-inform-death-tab"
          >
            <InformDeath />
          </div>
          <div
            class="tab-pane fade"
            id="nav-billing"
            role="tabpanel"
            aria-labelledby="nav-billing-tab"
          >
            <Billing />
          </div>
        </div>
      </div>
    );
  };

  return (
    <SideBar>
      <div class="body">
        <div class="content">
          <Breadcrumb pageName={'Settings'} />
          <div class="mt-4">{title()}</div>
          <div class="row mt-4">{tabSection()}</div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Settings;
