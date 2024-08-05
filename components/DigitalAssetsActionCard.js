import { bodiesCategory, instructionsAfterDeath } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import Loading from './Laoding';
import Image from 'next/image';

const DigitalAssetsActionCard = ({ onClickCard = () => {} }) => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const { tempData, setValueTempData } = useTempData();

  const instructionTypeConfig = [
    {
      title: 'Follow Faraid',
      description: 'Distribute your assets according to Islamic law',
      btnTitle: 'Add Assets',
      btnOnClick: () => {
        onClickCard();
        setValueTempData('digitalAssets', {
          ...tempData.digitalAssets,
          instructionType: 'faraid',
        });
      },
    },
    {
      title: 'Terminate Subscriptions',
      description: 'Say goodbye to digital services you no longer need',
      btnTitle: 'Add Assets',
      btnOnClick: () => {
        onClickCard();
        setValueTempData('digitalAssets', {
          ...tempData.digitalAssets,
          instructionType: 'terminate',
        });
      },
    },
    {
      title: 'Transfer as Gift',
      description: 'Share your wealth with your loved ones',
      btnTitle: 'Add Assets',
      btnOnClick: () => {
        onClickCard();
        setValueTempData('digitalAssets', {
          ...tempData.digitalAssets,
          instructionType: 'transfer_as_gift',
        });
      },
    },
    {
      title: 'Settle Debts',
      description: 'Settle any outstanding debts and loans.',
      btnTitle: 'Add Debts',
      btnOnClick: () => {
        onClickCard();
        setValueTempData('digitalAssets', {
          ...tempData.digitalAssets,
          instructionType: 'settle',
        });
      },
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

  return (
    <>
      <div class="d-flex overflow-auto gap-3 py-3 ps-4 pt-5">
        {instructionTypeConfig.map((item, index) => (
          <div
            class="card card-size-onhover text-center justify-content-center"
            style={{ minHeight: 200, minWidth: 200 }}
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
