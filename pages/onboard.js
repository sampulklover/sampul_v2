import BelovedModal from '../components/BelovedModal';
import DigitalAssetsActionCard from '../components/DigitalAssetsActionCard';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import Loading from '../components/Laoding';
import MyDetails from '../components/MyDetails';
import SideBar from '../components/SideBar';
import Stepper from '../components/stepper';
import { emptyUserImg } from '../constant/element';
import { belovedInviteStatus, belovedLevel } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Onboard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const [currentStep, setCurrentStep] = useState(0);

  var coSampulData = [];

  const loadingTable = ({ condition }) => {
    if (condition == false) {
      return (
        <div class="my-3 text-center">
          <Loading loading={true} />
        </div>
      );
    }

    return '';
  };

  const setBelovedModal = (item, category) => {
    setValueTempData('beloved', {
      ...tempData.invite,
      key: item ? 'edit' : 'add',
      category: category ? category : 'co_sampul',
      selectedItem: item ? item : null,
    });
    toggleModal('beloved');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: 'Your Details',
      heading: 'Complete Your Wasiat Profile',
      subheading: `Life changes, and so do your plans. Keep your Wasiat profile current by updating your personal information whenever necessary.`,
      view: <MyDetails isModal onSuccess={nextStep} />,
    },
    {
      title: 'Appoint your trusted person',
      heading: 'Trusted Hands',
      subheading:
        'Select a person you trust to handle your important information and carry out your wishes. Your Co-Sampul will ensure everything is taken care of just as you planned.',
      view: (
        <div>
          {loadingTable({ condition: !contextApiData.beloved.isLoading })}
          {contextApiData.beloved.data.length > 0 &&
          !contextApiData.beloved.isLoading ? (
            <div class="pointer-on-hover">
              <table class="table table-hover mb-0">
                <tbody>
                  {contextApiData.beloved.data?.map((item, index) => {
                    if (item.type == 'co_sampul') {
                      coSampulData.push(item);
                      // const rObject = relationships().find(
                      //   (x) => x.value === item.relationship
                      // );
                      const lObject = belovedLevel().find(
                        (x) => x.value === item.level
                      );

                      var status_invites = null;

                      if (item.beloved_invites.length > 0) {
                        status_invites = belovedInviteStatus().find(
                          (x) =>
                            x.value === item.beloved_invites[0].invite_status
                        );
                      }

                      const imageUrl = item.image_path
                        ? `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${item.image_path}`
                        : emptyUserImg;

                      return (
                        <tr key={index}>
                          <div
                            class="d-flex flex-wrap table-hover py-3 ps-3 px-3"
                            onClick={() => {
                              setBelovedModal(item, 'co_sampul');
                            }}
                          >
                            <div class="dp-image-wrapper">
                              <img
                                loading="lazy"
                                src={imageUrl}
                                alt=""
                                class="dp-image"
                              />
                            </div>
                            <div class="flex-grow-1">
                              <div class="smpl_text-sm-semibold crop-text">
                                <span>{item.name}</span>
                              </div>
                              <div class="smpl_text-sm-regular crop-text">
                                <span>{item?.email ? item.email : '-'}</span>
                              </div>
                            </div>

                            <div class="beloved-tag">
                              {status_invites ? (
                                <div class="badge is-badge-small">
                                  <span>
                                    {
                                      translations[locale]?.global[
                                        status_invites.value
                                      ]
                                    }
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                              <div class="badge is-badge-small">
                                <span>
                                  {translations[locale]?.global[lObject.value]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
              <div
                style={{
                  display: coSampulData.length < 2 ? 'block' : 'none',
                }}
                class="card-copy cosampul-copy"
                onClick={() => {
                  if (coSampulData.length < 2) {
                    setBelovedModal(null, 'co_sampul');
                  } else {
                    toast.error(
                      translations[locale].beloved.you_have_reached_,
                      {
                        duration: 6000,
                      }
                    );
                  }
                }}
              >
                <div class="beloved-block">
                  <div class="dp-image-wrapper">
                    <div class="smpl-icon-featured-outline-large">
                      <div class="uui-icon-1x1-xsmall-2 w-embed">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="smpl_text-sm-semibold">
                      {translations[locale].beloved.add_your_co_sampul}
                    </div>
                    <div class="smpl_text-sm-regular">
                      {translations[locale].beloved.co_sampul_is_your}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {contextApiData.beloved.data.length == 0 &&
              !contextApiData.beloved.isLoading ? (
                <BelovedModal isModalView={false} onSuccess={nextStep} />
              ) : (
                ''
              )}
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Decide what happens to your assets',
      heading: 'Decide what happens to your assets',
      subheading:
        'Your assets—both digital and physical—are a crucial part of the legacy you leave behind. At Sampul.co, you have the power to decide what happens to them. Do you want to follow as faraid, pass them on as a gift, settle any debts, or simply close down subscriptions you no longer need? Choose an option that best suits your wishes, and we’ll guide you through the process of securing your assets. It’s simple, straightforward, and gives you peace of mind knowing your asset is in good hands.',
      view: (
        <div>
          {contextApiData.digitalAssets.data.length > 0 &&
          !contextApiData.digitalAssets.isLoading ? (
            <>
              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <DigitalAssetsCard typeName={''} searchInput={''} />
              </div>
            </>
          ) : (
            <DigitalAssetsModal isModalView={false} onSuccess={nextStep} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="default-background-color">
      <div className="px-5 pb-5">
        <div className="py-5">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
          />
          <div class="text-center mt-4">
            <span className="heading-03">{steps[currentStep].heading}</span>
            <p className="paragraph-01">{steps[currentStep].subheading}</p>
          </div>
        </div>
        <div className="card">{steps[currentStep].view}</div>
      </div>
    </div>
  );
};

export default Onboard;
