import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import Footer from '../components/Footer';
import Loading from '../components/Laoding';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { useState, useEffect } from 'react';

const DigitalAssetsV1 = () => {
  const { locale } = useLocale();
  const [digitalAssetsModalType, setDigitalAssetsModalType] = useState({
    key: 'add',
    selectedItem: null,
  });

  const [searchInput, setSearchInput] = useState('');
  const [filteredValue, setFilteredValue] = useState('');

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setFilteredValue(searchInput);
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [searchInput]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

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
              {translations[locale].digital_assets.list_down_your_}
            </div>
            <div class="smpl_text-md-regular">
              {translations[locale].digital_assets.ensure_no_asset_}
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
              <Loading
                title={translations[locale].digital_assets.add_digital_assets_}
                loading={false}
              />
            </button>
            <div class="d-flex justify-content-md-end justify-content-center mt-2">
              <input
                value={searchInput}
                onChange={handleInputChange}
                class="form-control"
                type="search"
                placeholder={translations[locale].digital_assets.search}
                aria-label="Search"
                style={{ 'max-width': '275px' }}
              />
            </div>
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
              {translations[locale].digital_assets.view_all}
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
              {translations[locale].digital_assets.assets}
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
              {translations[locale].digital_assets.expenses}
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
                searchInput={filteredValue}
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
                searchInput={filteredValue}
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
                searchInput={filteredValue}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb
            pageName={translations[locale].digital_assets.digital_assets_and_}
          />
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

export default DigitalAssetsV1;

// The summary for this page includes:
// The page is designed to manage and display digital assets and expenses. It includes features like a search bar for filtering items
// and modal dialogs for adding or editing entries.
// There are tabs to categorize assets and expenses, allowing users to switch between different views seamlessly.
// Each tab section dynamically loads content based on user selections.
