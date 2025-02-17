import Loading from '../components/Laoding';
import Stepper from '../components/Stepper';
import TrustBeneficiaryInfo from '../components/TrustBeneficiaryInfo';
import TrustCareInfo from '../components/TrustCareInfo';
import TrustClientInfo from '../components/TrustClientInfo';
import TrustDisclosureInfo from '../components/TrustDisclosureInfo';
import TrustFinancialInfo from '../components/TrustFinancialInfo';
import TrustGetStarted from '../components/TrustGetStarted';
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

const OnboardTrust = ({ handleClose = () => {} }) => {
  const { locale } = useLocale();
  const router = useRouter();
  const { contextApiData, getTrust, addTrust, addTrustBeneficiary } = useApi();
  const { tempData, setValueTempData } = useTempData();
  const [currentStep, setCurrentStep] = useState(0);
  const [toggles, setToggles] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [trustData, setTrustData] = useState({});

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
    }
  };

  const commonCardStyle = { paddingLeft: '20%', paddingRight: '20%' };

  const createOnNextHandler = (stepIndex) => async () => {
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

  const addBeneficiaryApi = async (params) => {
    try {
      const result = await addTrustBeneficiary({
        trustData: params,
        trustId: trustData.id,
      });

      if (result) {
        toast.success('Saved!');
        nextStep();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stepsData = [
    {
      title: 'Get Started',
      heading: 'Get your trust account',
      subheading: 'Keep funds secure and available when they’re needed most.',
      view: TrustGetStarted,
      onSuccess: async () => {
        try {
          nextStep();
        } catch (error) {
          console.error(error);
        }
      },
      allowPrev: true,
      prevTitle: 'Maybe later',
      nextTitle: 'Get set up in minutes',
      showOnReview: false,
    },
    {
      title: 'Personal Info',
      heading: 'Let’s get to know you',
      subheading: '',
      view: TrustClientInfo,
      allowPrev: false,
      nextTitle: translations[locale].onboard.save_and_continue,
      showOnReview: true,
    },
    {
      title: 'Beneficiary',
      heading: 'Who will benefit',
      subheading: 'Tell us about the person you want to benefit',
      view: TrustBeneficiaryInfo,
      onSuccess: (data) => {
        addBeneficiaryApi(data);
      },
      allowPrev: false,
      nextTitle: translations[locale].onboard.save_and_continue,
      showOnReview: true,
    },
    {
      title: 'Donation',
      heading: 'Giving back',
      subheading:
        'When I no longer here, I’d like to donate from the Trust Fund to this charity',
      view: TrustGivingInfo,
      allowPrev: false,
      nextTitle: translations[locale].onboard.save_and_continue,
      showOnReview: true,
    },
    {
      title: 'Payment',
      heading: 'Payment Information',
      subheading: 'Complete your payment to create the trust',
      view: TrustPaymentInfo,
      allowPrev: false,
      nextTitle: translations[locale].onboard.save_and_continue,
      showOnReview: true,
    },
    {
      title: 'Done',
      heading: 'We have received your application',
      subheading:
        'Your trust account application is under review. We will get back to you and email you the status.',
      view: TrustReviewInfo,
      allowPrev: false,
      nextTitle: 'Back to main',
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
          onSubmitToggle={toggles[key] || 0}
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
      onPrev: () => {
        if (index > 0) {
          setCurrentStep(index - 1);
        } else {
          handleClose();
        }
      },
      onNext: createOnNextHandler(index),
      nextBtnTitle: step.nextTitle,
      prevBtnTitle: step.prevTitle || translations[locale].onboard.back,
      isLoading: isLoading[key] || false,
    };
  });

  return (
    <div className="vh-100">
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
            {steps[currentStep].title} ({currentStep + 1}/{steps.length})
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

export default OnboardTrust;
