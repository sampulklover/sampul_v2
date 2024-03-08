import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import { instructionsAfterDeath, servicePlatforms } from '../constant/enum';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import { addUserImg } from '../constant/element';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import SideBar from '../components/SideBar';

const DigitalAssets = () => {
  const { user } = useUser();
  const [summary, setSummary] = useState({
    data: [],
    isReady: false,
  });
  const [belovedList, setBelovedList] = useState({
    data: [],
    isReady: false,
  });
  const [isReady, setIsReady] = useState(true);
  const [runEffect, setRunEffect] = useState(false);
  const [digitalAssetsModalType, setDigitalAssetsModalType] = useState({
    key: 'add',
    selectedItem: null,
  });

  const getDigitalAssets = async () => {
    const { data, error } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('uuid', user?.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      setSummary({
        data: [],
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

  const getBeloved = async () => {
    const { data, error } = await supabase
      .from('beloved')
      .select('*')
      .eq('uuid', user?.uuid);

    if (error) {
      setBelovedList({
        data: [],
        isReady: true,
      });
      toast.error(error.message);
      return;
    }

    const modifiedData = data.map((item) => ({
      value: item.id,
      name: item.nric_name,
    }));

    setBelovedList({
      data: modifiedData,
      isReady: true,
    });
  };

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      getDigitalAssets();
      getBeloved();
    }
  }, [user, runEffect]);

  const digitalAssetsModal = (item) => {
    $('#digital-assets-modal')?.modal('show');

    setDigitalAssetsModalType({
      key: item ? 'edit' : 'add',
      selectedItem: item ? item : null,
    });
  };

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">
                List down your Digital Assets
              </div>
            </div>
            <div class="smpl_text-md-regular">
              Ensure no assets left behind for your loved ones
            </div>
          </div>
          <div class="col text-md-end text-center mt-md-0 mt-3">
            <button
              type="button"
              class="btn btn-primary btn-lg btn-text"
              onClick={() => {
                digitalAssetsModal(null);
              }}
            >
              <Loading title="Add Digital Assets" loading={false} />
            </button>
          </div>
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
              id="pills-all-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-all"
              type="button"
              role="tab"
              aria-controls="pills-all"
              aria-selected="true"
            >
              View all
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link smpl_text-sm-semibold"
              id="pills-non-subscription-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-non-subscription"
              type="button"
              role="tab"
              aria-controls="pills-non-subscription"
              aria-selected="false"
            >
              Non-Subscription
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link smpl_text-sm-semibold"
              id="pills-subscription-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-subscription"
              type="button"
              role="tab"
              aria-controls="pills-subscription"
              aria-selected="false"
            >
              Subscription
            </button>
          </li>
        </ul>
        <div
          class="tab-content mt-5"
          id="pills-tabContent"
          style={{ minHeight: 300 }}
        >
          <div
            class="tab-pane fade show active"
            id="pills-all"
            role="tabpanel"
            aria-labelledby="pills-all-tab"
          >
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <DigitalAssetsCard
                typeName=""
                summary={summary}
                editFunction={digitalAssetsModal}
              />
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-non-subscription"
            role="tabpanel"
            aria-labelledby="pills-non-subscription-tab"
          >
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <DigitalAssetsCard
                typeName="non_subscription"
                summary={summary}
                editFunction={digitalAssetsModal}
              />
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-subscription"
            role="tabpanel"
            aria-labelledby="pills-subscription-tab"
          >
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <DigitalAssetsCard
                typeName="subscription"
                summary={summary}
                editFunction={digitalAssetsModal}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body inner-body">
        <div class="content">
          <Breadcrumb pageName={'Digital Assets'} />
          <DigitalAssetsModal
            keyType={digitalAssetsModalType.key}
            selectedItem={digitalAssetsModalType.selectedItem}
            refreshFunction={getDigitalAssets}
            belovedList={belovedList.data}
          />
          <div class="mt-4">{title()}</div>
          {tabSection()}
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default DigitalAssets;
