import AccountsChart from '../components/AccountsChart';
import AllUser from '../components/AllUser';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import ManageBodies from '../components/ManageBodies';
import SideBar from '../components/SideBar';
import UsersChart from '../components/UsersChart';
import { useApi } from '../context/api';
import adminStyles from '../styles/admin.module.scss';
import { supabase } from '../utils/supabase';
import * as Sentry from '@sentry/nextjs';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

const Admin = () => {
  const { contextApiData } = useApi();
  const router = useRouter();

  const [summary, setSummary] = useState({
    data: {
      profiles: [],
      bodies: [],
    },
    isLoading: false,
  });

  useEffect(() => {
    if (router.isLoading && document) {
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
  }, [router.isLoading]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setSummary({
      ...summary,
      isLoading: true,
    });

    try {
      const [profilesResult, bodiesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select(
            '*, accounts (*), roles (*), beloved (*), digital_assets (*)'
          ),
        supabase.from('bodies').select('*').order('id', { ascending: false }),
      ]);

      if (profilesResult.error || bodiesResult.error) {
        setSummary({
          ...summary,
          isLoading: false,
        });
        if (profilesResult.error) toast.error(profilesResult.error.message);
        if (bodiesResult.error) toast.error(bodiesResult.error.message);
        return;
      }

      setSummary({
        ...summary,
        data: {
          profiles: profilesResult.data,
          bodies: bodiesResult.data,
        },
        isLoading: false,
      });
    } catch (error) {
      setSummary({
        ...summary,
        isLoading: false,
      });
      Sentry.captureException(error);
    }
  };

  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">Admin Overview</div>
            <div class="smpl_text-md-regular">
              Overview of secured assets in your Sampul
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const chartSection1 = () => {
    return (
      <div>
        <UsersChart summary={summary} refreshFunction={fetchData} />
      </div>
    );
  };

  const chartSection2 = () => {
    return (
      <div>
        <span class={adminStyles.sectionTitle}>Digital Accounts</span>
        <AccountsChart summary={summary} refreshFunction={fetchData} />
      </div>
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
            <button
              class="nav-link"
              id="nav-bodies-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-bodies"
              type="button"
              role="tab"
              aria-controls="nav-bodies"
              aria-selected="false"
            >
              Manage Bodies
            </button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-users"
            role="tabpanel"
            aria-labelledby="nav-users-tab"
          >
            <AllUser summary={summary} refreshFunction={fetchData} />
          </div>
          <div
            class="tab-pane fade"
            id="nav-bodies"
            role="tabpanel"
            aria-labelledby="nav-bodies-tab"
          >
            <ManageBodies summary={summary} refreshFunction={fetchData} />
          </div>
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
              <button type="button" class="btn btn-primary btn-text">
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
      <div class={`body inner-body-01 ${inter.className}`}>
        <div class="content">
          {contextApiData.role.data?.role == 'admin' ? (
            <>
              <Breadcrumb pageName={'Admin'} />
              <div class="mt-4">{title()}</div>
              <div class="row mt-3">
                <div class="col-md-7 mb-3">{chartSection1()}</div>
                <div class="col-md-5">{chartSection2()}</div>
              </div>
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

// Summary for this page includes:
// The page in Sampul's interface serves as an overview of secure assets,
// accessible only to users with administrative privileges.
// It includes a breadcrumb for navigation, a title section describing its purpose,
// and two charts: one for user data and another for digital accounts.
// The page features tabs for navigating between user listings and organizational body management.
// If accessed without proper permissions, an error message prompts users to return to the dashboard.
