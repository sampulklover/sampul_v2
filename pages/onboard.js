import BelovedModal from '../components/BelovedModal';
import Billing from '../components/Billing';
import DigitalAssetsActionCard from '../components/DigitalAssetsActionCard';
import DigitalAssetsCard from '../components/DigitalAssetsCard';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import InnerHeader from '../components/InnerHeader';
import Loading from '../components/Laoding';
import MyDetails from '../components/MyDetails';
import SideBar from '../components/SideBar';
import Stepper from '../components/Stepper';
import { emptyUserImg } from '../constant/element';
import { belovedInviteStatus, belovedLevel } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { formatTimestamp } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Onboard = () => {
  const { contextApiData, getProfile } = useApi();
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

  useEffect(() => {
    if (currentStep !== 0) {
      try {
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error scrolling to top:', error);
      }
    }
  }, [currentStep]);

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

  const [onSubmitToggleMyDetails, setOnSubmitToggleMyDetails] = useState(false);

  const [isLoading, setIsLoading] = useState({
    steps: {
      myDetails: false,
    },
  });

  const steps = [
    {
      cardStyle: { paddingLeft: '20%', paddingRight: '20%' },
      stageTitle: '1',
      title: translations[locale].onboard.your_details,
      heading: translations[locale].onboard.complete_your_wasiat,
      subheading: translations[locale].onboard.life_changes_and_,
      view: (
        <MyDetails
          parentPage="onboard"
          onSubmitToggle={onSubmitToggleMyDetails}
          setOnSubmitToggle={setOnSubmitToggleMyDetails}
          onSuccess={nextStep}
        />
      ),
      allowPrev: false,
      onNext: () => {
        setIsLoading((prevState) => ({
          ...prevState,
          steps: {
            ...prevState.steps,
            step1: true,
          },
        }));
        setOnSubmitToggleMyDetails(true);

        const waitPromises = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });

        waitPromises
          .then(() => {
            setOnSubmitToggleMyDetails(false);
          })
          .catch((error) => {
            console.error('Error in waitPromises:', error);
          })
          .finally(() => {
            setIsLoading((prevState) => ({
              ...prevState,
              steps: {
                ...prevState.steps,
                step1: false,
              },
            }));
          });
      },
      nextBtnTitle: translations[locale].onboard.save_and_continue,
      isLoading: isLoading.steps.step1,
    },
    {
      cardStyle: { paddingLeft: '20%', paddingRight: '20%' },
      stageTitle: '2',
      title: translations[locale].onboard.my_plan,
      heading: translations[locale].onboard.find_the_perfect_,
      subheading: translations[locale].onboard.simple_transparent_pricing,
      view: (
        <>
          <Billing onSuccess={nextStep} />
        </>
      ),
      allowPrev: true,
      onPrev: () => {
        prevStep();
      },
      onNext: () => {
        nextStep();
      },
      nextBtnTitle: translations[locale].onboard.skip,
      isLoading: isLoading.steps.step2,
    },
    {
      cardStyle: { paddingLeft: '20%', paddingRight: '20%' },
      stageTitle: '3',
      title: translations[locale].onboard.appoint_trusted_person,
      heading: translations[locale].onboard.trusted_hands,
      subheading: translations[locale].onboard.select_a_person_,
      view: (
        <div>
          <div class="card mb-3">
            {loadingTable({ condition: !contextApiData.beloved.isLoading })}
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
          </div>
        </div>
      ),
      allowPrev: true,
      onPrev: () => {
        prevStep();
      },
      onNext: () => {
        if (
          contextApiData.beloved.data.length > 0 &&
          !contextApiData.beloved.isLoading &&
          contextApiData.beloved.data.some(
            (dataItem) => dataItem.type === 'co_sampul'
          )
        ) {
          nextStep();
        } else {
          toast.error(translations[locale].onboard.please_add_cosampul_);
        }
      },
      nextBtnTitle: translations[locale].onboard.next,
      isLoading: isLoading.steps.step3,
    },
    {
      stageTitle: '4',
      title: translations[locale].onboard.add_assets,
      heading: (
        <span class="px-2">
          {translations[locale].onboard.decide_what_happens_}
        </span>
      ),
      subheading: (
        <span class="px-2">
          {translations[locale].onboard.your_digital_and_}
        </span>
      ),
      view: (
        <div class="pb-5">
          <div class="px-5">
            <DigitalAssetsActionCard />
          </div>
          <div class="text-center mt-5">
            <span class="heading-03">
              {translations[locale].onboard.your_registered_assets}
            </span>
          </div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3 mt-3 px-5">
            <DigitalAssetsCard typeName={''} searchInput={''} />
          </div>
        </div>
      ),
      allowPrev: true,
      onPrev: () => {
        prevStep();
      },
      onNext: async () => {
        if (
          contextApiData.digitalAssets.data.length > 0 &&
          !contextApiData.digitalAssets.isLoading
        ) {
          setIsLoading((prevState) => ({
            ...prevState,
            steps: {
              ...prevState.steps,
              step4: true,
            },
          }));

          const { data: returnData, error } = await supabase
            .from('profiles')
            .update({
              isOnboard: true,
            })
            .eq('uuid', contextApiData.user.data?.id);

          if (error) {
            toast.error(error.message);
          }

          setTimeout(() => {
            getProfile(true);
          }, 1000);

          const waitPromises = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 3000);
          });

          waitPromises
            .then(() => {
              router.push({
                pathname: '/will',
                query: { generate: true },
              });
            })
            .catch((error) => {
              console.error('Error in waitPromises:', error);
            })
            .finally(() => {
              setIsLoading((prevState) => ({
                ...prevState,
                steps: {
                  ...prevState.steps,
                  step4: false,
                },
              }));
            });
        } else {
          toast.error(translations[locale].onboard.please_add_asset_);
        }
      },
      nextBtnTitle: translations[locale].onboard.generate_wasiat_will,
      isLoading: isLoading.steps.step4,
    },
    {
      stageTitle: '5',
      title: translations[locale].onboard.generate_wasiat_will,
      stepIcon: <i class="bi bi-file-earmark-text"></i>,
      heading: '-',
      subheading: '-',
      view: <div></div>,
      allowPrev: true,
      onPrev: () => {
        prevStep();
      },
      onNext: () => {},
      nextBtnTitle: translations[locale].onboard.next,
      isLoading: isLoading.steps.step5,
    },
  ];

  return (
    <div className="vh-100 default-background-color">
      <div className="pt-5">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </div>
      <div
        className="default-background-color pb-5 pr-100"
        style={steps[currentStep].cardStyle} // mobile 10%
      >
        <div class="text-center mt-5">
          <span className="heading-03">{steps[currentStep].heading}</span>
          <p className="paragraph-01">{steps[currentStep].subheading}</p>
        </div>
        <div class="pb-5">{steps[currentStep].view}</div>
        <footer className="bg-white border-top text-end py-3 px-3 fixed-bottom">
          <span class="text-muted me-3">
            {steps[currentStep].title} {steps[currentStep].stageTitle}/
            {steps.length - 1}
          </span>
          {steps[currentStep].allowPrev ? (
            <button
              type="button"
              class="btn btn-light btn-text me-2"
              onClick={() => steps[currentStep].onPrev()}
            >
              {translations[locale].onboard.back}
            </button>
          ) : (
            ''
          )}
          <button
            type="button"
            class="btn btn-primary btn-text"
            onClick={() => steps[currentStep].onNext()}
          >
            <Loading
              title={
                <>
                  {steps[currentStep].nextBtnTitle}{' '}
                  <i class="bi bi-arrow-right ms-1"></i>
                </>
              }
              loading={steps[currentStep].isLoading}
            />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Onboard;
