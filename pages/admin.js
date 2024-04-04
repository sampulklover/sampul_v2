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
            <div class="smpl_display-sm-semibold">Admin</div>
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
      <div class="body inner-body">
        <div class="content">
          {contextApiData.role.data?.role == 'admin' ? (
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
