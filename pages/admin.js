import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import SideBar from '../components/SideBar';
import AllUser from '../components/AllUser';
import ManageBodies from '../components/ManageBodies';
import { useApi } from '../context/api';
import * as Sentry from '@sentry/nextjs';
import { Inter } from 'next/font/google';
import adminStyles from '../styles/admin.module.scss';
import UsersChart from '../components/UsersChart';
import AccountsChart from '../components/AccountsChart';

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

  const chartMenuCard = ({
    title = 'Title',
    value = '0',
    percentage = '0%',
  }) => {
    const status = 'danger';

    const themeConfig = {
      success: {
        theme: adminStyles.success,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="trend-up-01">
              <path
                id="Icon"
                d="M11 3.5L7.06568 7.43432C6.86768 7.63232 6.76867 7.73133 6.65451 7.76842C6.55409 7.80105 6.44591 7.80105 6.34549 7.76842C6.23133 7.73133 6.13232 7.63232 5.93431 7.43431L4.56568 6.06568C4.36768 5.86768 4.26867 5.76867 4.15451 5.73158C4.05409 5.69895 3.94591 5.69895 3.84549 5.73158C3.73133 5.76867 3.63232 5.86768 3.43431 6.06569L1 8.5M11 3.5H7.5M11 3.5V7"
                stroke="#17B26A"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        ),
      },
      danger: {
        theme: adminStyles.danger,
        icon: (
          <svg
            width="13"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="trend-down-01" clip-path="url(#clip0_454_3681)">
              <path
                id="Icon"
                d="M11.3333 8.5L7.39894 4.56568C7.20093 4.36768 7.10192 4.26867 6.98776 4.23158C6.88734 4.19895 6.77917 4.19895 6.67874 4.23158C6.56458 4.26867 6.46558 4.36768 6.26757 4.56569L4.89894 5.93432C4.70093 6.13232 4.60192 6.23133 4.48776 6.26842C4.38734 6.30105 4.27917 6.30105 4.17874 6.26842C4.06458 6.23133 3.96557 6.13232 3.76757 5.93431L1.33325 3.5M11.3333 8.5H7.83325M11.3333 8.5V5"
                stroke="#F04438"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_454_3681">
                <rect
                  width="12"
                  height="12"
                  fill="white"
                  transform="translate(0.333252)"
                />
              </clipPath>
            </defs>
          </svg>
        ),
      },
    };

    return (
      <>
        <div className={adminStyles.tabContainer}>
          <div className={adminStyles.tabHeader}>
            <div className={adminStyles.tabTitle}>{title}</div>
            <div className={adminStyles.totalUsers}>
              <div className={adminStyles.totalUsersValue}>{value}</div>
              <div
                className={`${adminStyles.percentageContainer} ${themeConfig[status].theme}`}
              >
                {themeConfig[status].icon}
                <div
                  className={`${adminStyles.percentageValue} ${themeConfig[status].theme}`}
                >
                  {percentage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const chartSection1 = () => {
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
              {chartMenuCard({
                title: 'Total Users',
                value: '0',
                percentage: '0%',
              })}
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
              {chartMenuCard({
                title: 'Basic Users',
                value: '0',
                percentage: '0%',
              })}
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
              {chartMenuCard({
                title: 'Premium Users',
                value: '0',
                percentage: '0%',
              })}
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
            <UsersChart summary={summary} refreshFunction={fetchData} />
          </div>
          <div
            class="tab-pane fade"
            id="nav-bodies"
            role="tabpanel"
            aria-labelledby="nav-bodies-tab"
          >
            {/* <ManageBodies summary={summary} refreshFunction={fetchData} /> */}
          </div>
        </div>
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
      <div class={`body inner-body ${inter.className}`}>
        <div class="content">
          {contextApiData.role.data?.role == 'admin' ? (
            <>
              <Breadcrumb pageName={'Admin'} />
              <div class="mt-4">{title()}</div>
              {/* <div class="row mt-3">
                <div class="col-md-7">{chartSection1()}</div>
                <div class="col-md">{chartSection2()}</div>
              </div> */}
              <div class="row mt-3">{tabSection()}</div>
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
