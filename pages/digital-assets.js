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
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const DigitalAssets = () => {
  const { locale } = useLocale();
  const router = useRouter();
  const [digitalAssetsModalType, setDigitalAssetsModalType] = useState({
    key: 'add',
  });

  const [searchInput, setSearchInput] = useState('');
  const [filteredValue, setFilteredValue] = useState('');
  const { tempData, setValueTempData } = useTempData();

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
    });

    setValueTempData('digitalAssets', {
      ...tempData.digitalAssets,
      selectedItem: item ? item : null,
    });
  };

  const tabConfig = [
    {
      title: 'View all',
      type: '',
    },
    {
      title: 'Terminate',
      type: 'terminate',
    },
    {
      title: 'Gift',
      type: 'gift',
    },
    {
      title: 'Faraid',
      type: 'faraid',
    },
    {
      title: 'Settle',
      type: 'settle',
    },
  ];

  const [selectedTab, setSelectedTab] = useState('');

  const tabSection = () => {
    return (
      <>
        <div class="text-center mt-3">
          <span class="heading-03">Your Registered Assets</span>
        </div>
        <ul
          class="nav nav-pills justify-content-center tab-background mt-3"
          id="pills-tab"
          role="tablist"
        >
          {tabConfig.map((item) => {
            return (
              <li class="nav-item" role="presentation">
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
          {tabConfig.map((item) => {
            return (
              <div
                class={`tab-pane fade ${
                  selectedTab == item.type ? 'show active' : ''
                }`}
                id={`pills-${item.type}`}
                role="tabpanel"
                aria-labelledby={`pills-${item.type}-tab`}
              >
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  <DigitalAssetsCard
                    typeName={item.type}
                    editFunction={digitalAssetsModal}
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
          <Breadcrumb
            pageName="Manage Assets"
            rightSection={
              <button
                type="button"
                class="btn btn-primary btn-sm"
                onClick={() => {
                  router.push('will');
                }}
              >
                <Loading title="Preview Wasiat" />
              </button>
            }
          />
          <InnerHeader
            title="Decide What Happens  to Your Asset"
            subtitle={`Your assets are an important part of your legacy. Here, you can make thoughtful decisions about how your digital and physical assets will be handled when you're no longer around. Simply choose an option below and provide the details. It's quick, easy, and gives you peace of mind.`}
            imageSrc="images/treasure-chest.svg"
          />
          <DigitalAssetsModal keyType={digitalAssetsModalType.key} />
          <DigitalAssetsActionCard
            onClickCard={() => {
              digitalAssetsModal(null);
            }}
          />
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
