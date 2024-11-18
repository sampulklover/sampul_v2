import { bodiesCategory, instructionsAfterDeath } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import Loading from './Laoding';
import Image from 'next/image';

const DigitalAssetsActionCard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();

  const instructionTypeConfig = [
    {
      title: translations[locale].digital_assets.follow_faraid,
      description: translations[locale].digital_assets.distribute_your_assets_,
      btnTitle: translations[locale].digital_assets.add_assets,
      btnOnClick: () => {
        toggleModal('assets');
        setValueTempData('assets', {
          ...tempData.assets,
          key: 'add',
          instructionType: 'faraid',
          selectedItem: null,
        });
      },
      isMuslimOnly: true,
    },
    {
      title: translations[locale].digital_assets.terminate_subscriptions,
      description: translations[locale].digital_assets.say_goodbye_to_,
      btnTitle: translations[locale].digital_assets.add_assets,
      btnOnClick: () => {
        toggleModal('assets');
        setValueTempData('assets', {
          ...tempData.assets,
          key: 'add',
          instructionType: 'terminate',
          selectedItem: null,
        });
      },
      isMuslimOnly: false,
    },
    {
      title: translations[locale].digital_assets.transfer_as_gift,
      description: translations[locale].digital_assets.share_your_wealth_,
      btnTitle: translations[locale].digital_assets.add_assets,
      btnOnClick: () => {
        toggleModal('assets');
        setValueTempData('assets', {
          ...tempData.assets,
          key: 'add',
          instructionType: 'transfer_as_gift',
          selectedItem: null,
        });
      },
      isMuslimOnly: false,
    },
    {
      title: translations[locale].digital_assets.settle_debts,
      description: translations[locale].digital_assets.settle_any_outstanding_,
      btnTitle: translations[locale].digital_assets.add_debts,
      btnOnClick: () => {
        toggleModal('assets');
        setValueTempData('assets', {
          ...tempData.assets,
          key: 'add',
          instructionType: 'settle',
          selectedItem: null,
        });
      },
      isMuslimOnly: false,
    },
  ];

  const getBodyData = () => {
    const bodyData = contextApiData.bodies.data
      ?.filter(
        (item) =>
          item.category !== 'sadaqah_waqaf_zakat' && item.category !== 'waqaf'
      )
      .map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));

    if (bodyData?.length > 0) {
      return bodyData;
    } else {
      return [];
    }
  };

  const featuredIconList = () => {
    const data = getBodyData();

    if (data.length == 0) {
      return (
        <div class="text-center">
          <Loading loading={true} />
        </div>
      );
    }

    return (
      <div className="row gap-1 justify-content-center">
        {data.slice(0, 5).map((item, index) => (
          <div class="col col-auto p-0" key={index}>
            <img
              loading="lazy"
              src={
                item?.icon
                  ? `data:image/svg+xml,${encodeURIComponent(item.icon)}`
                  : '/images/Displacement-p-500.png'
              }
              alt=""
              className="avatar-8"
              style={{
                width: 30,
                height: 30,
                transition: 'transform 0.5s ease',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const checkReligion = () => {
    return contextApiData.profile.data?.religion === 'islam';
  };

  return (
    <>
      <div class="d-flex overflow-auto gap-3 py-3 ps-4">
        {instructionTypeConfig
          .filter((item) => checkReligion() || !item.isMuslimOnly)
          .map((item, index) => (
            <div
              class="card card-size-onhover text-center justify-content-center"
              style={{ minHeight: 200, minWidth: 250, maxWidth: 300 }}
              key={index}
            >
              <div class="gap-2 mb-4 h-100">
                <div>
                  <Image
                    src="images/featured-icon.svg"
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: 40, height: 40 }}
                  />
                </div>
                <span class="heading-02">{item.title}</span>
                <p class="paragraph-02">{item.description}</p>
                <div>{featuredIconList()}</div>
              </div>
              <button
                type="button"
                class="btn btn-primary"
                onClick={item.btnOnClick}
              >
                <Loading title={item.btnTitle} />
              </button>
            </div>
          ))}
      </div>
    </>
  );
};

export default DigitalAssetsActionCard;
