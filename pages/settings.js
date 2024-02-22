import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
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

const Settings = () => {
  const { user, isLoading } = useUser();
  const [summary, setSummary] = useState({
    data: [],
    isReady: false,
  });
  const [isReady, setIsReady] = useState(true);
  const [runEffect, setRunEffect] = useState(false);
  const [belovedModalType, setBelovedModalType] = useState({
    key: 'add',
    selectedItem: null,
  });

  const getSettings = async () => {
    const { data, error } = await supabase
      .from('beloved')
      .select('*')
      .eq('uuid', user.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      setSummary({
        data: null,
        isReady: true,
      });
      toast.error(error.message);
      return;
    }

    setSummary({
      data: data,
      isReady: true,
    });
  };

  useEffect(() => {
    if (!runEffect && user.uuid !== null) {
      setRunEffect(true);
      getSettings();
    }
  }, [user, runEffect]);

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
            ...
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="body">
      <div class="content">
        <Breadcrumb pageName={'Settings'} />
        <div class="mt-4">{title()}</div>
        <div class="row mt-4">{tabSection()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
