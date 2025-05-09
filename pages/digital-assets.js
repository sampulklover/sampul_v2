import Breadcrumb from '../components/Breadcrumb';
import DigitalAssetsActionCard from '../components/DigitalAssetsActionCard';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import Footer from '../components/Footer';
import InnerHeader from '../components/InnerHeader';
import Loading from '../components/Laoding';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const DigitalAssets = () => {
  const { locale } = useLocale();
  const router = useRouter();

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

  const tabConfig = [
    {
      title: translations[locale].digital_assets.view_all,
      type: '',
    },
    {
      title: translations[locale].digital_assets.terminate,
      type: 'terminate',
    },
    {
      title: translations[locale].digital_assets.gift,
      type: 'gift',
    },
    {
      title: translations[locale].digital_assets.faraid,
      type: 'faraid',
    },
    {
      title: translations[locale].digital_assets.settle,
      type: 'settle',
    },
  ];

  const [selectedTab, setSelectedTab] = useState('');

  const tabSection = () => {
    return (
      <>
        <div class="text-center mt-3">
          <span class="heading-03">
            {translations[locale].digital_assets.your_registered_assets}
          </span>
        </div>
        <ul
          class="nav nav-pills justify-content-center tab-background mt-3"
          id="pills-tab"
          role="tablist"
        >
          {tabConfig.map((item, index) => {
            return (
              <li class="nav-item" role="presentation" key={index}>
                <button
                  class={`nav-link smpl_text-sm-semibold ${
                    selectedTab == item.type ? 'active' : ''
                  }`}
                  id={`pills-${item.type}-tab`}
                  data-bs-toggle="pill"
                  data-bs-target={`#pills-${item.type}`}
                  type="button"
                  role="tab"
                  aria-controls={`pills-${item.type}`}
                  aria-selected={selectedTab == item.type ? true : false}
                  onClick={() => {
                    setSelectedTab(item.type);
                  }}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
        <div
          class="tab-content mt-5"
          id="pills-tabContent"
          style={{ minHeight: 300 }}
        >
          {tabConfig.map((item, index) => {
            return (
              <div
                class={`tab-pane fade ${
                  selectedTab == item.type ? 'show active' : ''
                }`}
                id={`pills-${item.type}`}
                role="tabpanel"
                aria-labelledby={`pills-${item.type}-tab`}
                key={index}
              >
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  <DigitalAssetsCard
                    typeName={item.type}
                    searchInput={filteredValue}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb pageName="Manage Assets" />
          <InnerHeader
            title={translations[locale].digital_assets.decide_what_happens_}
            subtitle={translations[locale].digital_assets.your_assets_are_}
            imageSrc="images/treasure-chest.svg"
          />
          <DigitalAssetsActionCard />
          {tabSection()}
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default DigitalAssets;

// The summary for this page includes:
// The page is designed to manage and display digital assets and expenses. It includes features like a search bar for filtering items
// and modal dialogs for adding or editing entries.
// There are tabs to categorize assets and expenses, allowing users to switch between different views seamlessly.
// Each tab section dynamically loads content based on user selections.
