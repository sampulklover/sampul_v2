import ExecutorApplicantInfo from '../components/ExecutorApplicantInfo';
import ExecutorDeceasedAssets from '../components/ExecutorDeceasedAssets';
import ExecutorDeceasedInfo from '../components/ExecutorDeceasedInfo';
import ExecutorGetStarted from '../components/ExecutorGetStarted';
import ExecutorGuardianInfo from '../components/ExecutorGuardianInfo';
import ExecutorReceiveInfo from '../components/ExecutorReviewInfo';
import ExecutorSupportingDocuments from '../components/ExecutorSupportingDocuments';
import Loading from '../components/Laoding';
import Stepper from '../components/Stepper';
import TrustGivingInfo from '../components/TrustGivingInfo';
import TrustPaymentInfo from '../components/TrustPaymentInfo';
import TrustReviewInfo from '../components/TrustReviewInfo';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OnboardExecutor = ({ handleClose = () => {} }) => {
  const { locale } = useLocale();
  const router = useRouter();
  const { contextApiData, getTrust, addTrust, addTrustBeneficiary } = useApi();
  const { tempData, setValueTempData } = useTempData();
  const [currentStep, setCurrentStep] = useState(0);
  const [toggles, setToggles] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [trustData, setTrustData] = useState({});
  const [stopToggle, setStopToggle] = useState(false);

  const t = translations[locale].executor.onboard;

  const scrollToTop = () => {
    const modalContainer = document.querySelector('.vh-100');
    if (modalContainer) {
      modalContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (tempData.trust.selectedItem?.id) {
      const foundTrust = contextApiData.trust.data.find(
        (trust) => trust.id === tempData.trust.selectedItem.id
      );

      if (foundTrust) {
        setTrustData(foundTrust);
      } else {
        console.log('No matching trust found.');
      }
    }
  }, [tempData.trust.selectedItem]);

  useEffect(() => {
    if (currentStep !== 0) {
      try {
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error scrolling to top:', error);
      }
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const commonCardStyle = { paddingLeft: '20%', paddingRight: '20%' };

  const createOnNextHandler = (stepIndex) => async () => {
    setStopToggle(false);
    scrollToTop();
    if (stepIndex == stepsData.length - 1) {
      handleClose();
    } else {
      const key = `step${stepIndex}`;
      setToggles((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1, // Increment counter instead of toggle to detect multiple submission on useEffect
      }));
    }
  };

  const createOnPrevHandler = (stepIndex) => async () => {
    setStopToggle(true);
    if (stepIndex === 0) {
      handleClose();
    } else {
      setCurrentStep(stepIndex - 1);
    }
  };

  const stepsData = [
    {
      title: t.get_started.title,
      heading: t.get_started.heading,
      subheading: t.get_started.subheading,
      view: ExecutorGetStarted,
      onSuccess: async () => {
        try {
          nextStep();
        } catch (error) {
          console.error(error);
        }
      },
      allowPrev: true,
      prevTitle: t.get_started.maybe_later,
      nextTitle: t.get_started.get_setup,
      showOnReview: false,
    },
    {
      title: t.applicant_info.title,
      heading: t.applicant_info.heading,
      subheading: t.applicant_info.subheading,
      view: ExecutorApplicantInfo,
      allowPrev: false,
      nextTitle: t.save_continue,
      showOnReview: true,
    },
    {
      title: t.deceased_info.title,
      heading: t.deceased_info.heading,
      subheading: t.deceased_info.subheading,
      view: ExecutorDeceasedInfo,
      allowPrev: true,
      nextTitle: t.save_continue,
      showOnReview: true,
    },
    {
      title: t.assets_info.title,
      heading: t.assets_info.heading,
      subheading: t.assets_info.subheading,
      view: ExecutorDeceasedAssets,
      allowPrev: true,
      nextTitle: t.save_continue,
      showOnReview: true,
    },
    {
      title: t.guardian_info.title,
      heading: t.guardian_info.heading,
      subheading: t.guardian_info.subheading,
      view: ExecutorGuardianInfo,
      allowPrev: true,
      nextTitle: t.save_continue,
      showOnReview: true,
    },
    {
      title: t.documents.title,
      heading: t.documents.heading,
      subheading: t.documents.subheading,
      view: ExecutorSupportingDocuments,
      allowPrev: true,
      nextTitle: t.continue,
      showOnReview: true,
    },
    {
      title: t.done.title,
      heading: t.done.heading,
      subheading: t.done.subheading,
      view: ExecutorReceiveInfo,
      allowPrev: true,
      nextTitle: t.back_to_main,
      showOnReview: true,
    },
  ];

  const steps = stepsData.map((step, index) => {
    const key = `step${index}`;
    const StepComponent = step.view;

    return {
      cardStyle: commonCardStyle,
      title: step.title,
      heading: step.heading,
      subheading: step.subheading,
      view: (
        <StepComponent
          onSubmitToggle={stopToggle ? 0 : toggles[key] || 0}
          setOnSubmitToggle={(value) =>
            setToggles((prev) => ({ ...prev, [key]: value }))
          }
          onSuccess={step.onSuccess}
          trustData={trustData}
          stepsData={stepsData}
          nextStep={nextStep}
        />
      ),
      allowPrev: step.allowPrev,
      onPrev: createOnPrevHandler(index),
      onNext: createOnNextHandler(index),
      nextBtnTitle: step.nextTitle,
      prevBtnTitle: step.prevTitle || t.back,
      isLoading: isLoading[key] || false,
    };
  });

  return (
    <div className="vh-100 overflow-auto">
      <div className="pt-5">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>
      <div
        className="bg-white pb-5 pr-100"
        style={steps[currentStep].cardStyle} // mobile 10%
      >
        <div class="text-center mt-5">
          <span className="heading-03">{steps[currentStep].heading}</span>
          <p className="paragraph-01">{steps[currentStep].subheading}</p>
        </div>
        <div class="pb-5">{steps[currentStep].view}</div>
        <footer className="bg-white border-top text-end py-3 px-3 fixed-bottom">
          <span className="text-muted me-3">
            {steps[currentStep].title} ({currentStep + 1} {t.step_of}{' '}
            {steps.length})
          </span>
          {steps[currentStep].allowPrev ? (
            <button
              type="button"
              class="btn btn-light btn-text me-2"
              onClick={() => steps[currentStep].onPrev()}
            >
              {steps[currentStep].prevBtnTitle}
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

export default OnboardExecutor;
