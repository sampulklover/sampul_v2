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
import AllUser from '../components/AllUser';

const Admin = () => {
  const router = useRouter();
  const { user } = useUser();

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
              <div class="smpl_display-sm-semibold">Admin</div>
            </div>
            <div class="smpl_text-md-regular">
              Manage Sampul records on this platform here
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
              id="nav-users-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-users"
              type="button"
              role="tab"
              aria-controls="nav-users"
              aria-selected="true"
            >
              Users
            </button>
            {/* <button
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
            </button> */}
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-users"
            role="tabpanel"
            aria-labelledby="nav-users-tab"
          >
            <AllUser />
          </div>
          {/* <div
            class="tab-pane fade"
            id="nav-password"
            role="tabpanel"
            aria-labelledby="nav-password-tab"
          >
            <Password />
          </div> */}
        </div>
      </div>
    );
  };

  const noPermissionView = () => {
    return (
      <>
        <div class="empty-data-card p-5">
          <div class="content-67">
            <div class="text-and-supporting-text-32">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="red"
                class="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
              <div class="smpl_display-sm-semibold mt-3">
                Oops! Something Went Wrong
              </div>
              <div class="smpl_text-md-regular">
                It seems you don't have authorized access to this page.
              </div>
            </div>
          </div>
          <div class="mt-4">
            <Link href="dashboard">
              <button type="button" class="btn btn-primary btn-text btn-lg">
                <i class="bi bi-arrow-left"></i> Back to dashboard
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body inner-body">
        <div class="content">
          {user?.role?.role == 'admin' ? (
            <>
              <Breadcrumb pageName={'Admin'} />
              <div class="mt-4">{title()}</div>
              <div class="row mt-4">{tabSection()}</div>
            </>
          ) : (
            noPermissionView()
          )}
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Admin;
