import { useState } from 'react';
import Loading from '../components/Laoding';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import SideBar from '../components/SideBar';

const DigitalAssets = () => {
  const [digitalAssetsModalType, setDigitalAssetsModalType] = useState({
    key: 'add',
    selectedItem: null,
  });

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
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              List down your Digital Assets & Expenses
            </div>
            <div class="smpl_text-md-regular">
              Ensure no asset is left behind for your loved ones
            </div>
          </div>
          <div class="col text-md-end text-center mt-md-0 mt-3">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                digitalAssetsModal(null);
              }}
            >
              <Loading title="Add Digital Assets & Expenses" loading={false} />
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
          <Breadcrumb pageName={'Digital Assets & Expenses'} />
          <DigitalAssetsModal
            keyType={digitalAssetsModalType.key}
            selectedItem={digitalAssetsModalType.selectedItem}
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
