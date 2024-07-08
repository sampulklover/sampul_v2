import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import successWillAnimationData from '../public/animation/lottie_will_success_generated.json';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import ShareModal from './ShareModal';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Lottie from 'react-lottie';

const WillActionButtons = ({ viewOnly = false }) => {
  const { contextApiData, getWill } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  const [shareUrl, setShareUrl] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    generate: false,
    download: false,
  });

  useEffect(() => {
    function shouldRunReadyFunction() {
      if (viewOnly) {
        return router.isReady;
      } else {
        return router.isReady && contextApiData.user.data?.id;
      }
    }

    if (shouldRunReadyFunction()) {
      readyFunction();
    }
  }, [router.isReady, contextApiData.user.data, viewOnly]);

  const readyFunction = () => {
    fetchWillData();
    const download = router.query.download === 'true';
    if (download) {
      setTimeout(() => {
        downloadCert();
      }, 1000);
    }
  };

  const fetchWillData = async () => {
    if (viewOnly == false) {
      const { data, error } = await supabase
        .from('wills')
        .select(`*, profiles ( * )`)
        .eq('uuid', contextApiData.user.data?.id);

      if (error) {
        toast.error(error.message);
      }

      if (data?.length > 0) {
        if (data[0]?.will_code) {
          var url = `${process.env.NEXT_PUBLIC_HOST}/view-will?id=${data[0].will_code}`;
          setShareUrl(url);
        }
      }
    } else {
      const will_id = router.query.id;
      var url = `${process.env.NEXT_PUBLIC_HOST}/view-will?id=${will_id}`;
      setShareUrl(url);
    }
  };

  const generateWillId = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 10000000000);
    const randomId = `SMPL-${currentYear}-${randomDigits
      .toString()
      .padStart(10, '0')}`;

    return randomId;
  };

  const onAnimationComplete = () => {
    setShowAnimation(false);
  };

  const generateWill = async () => {
    setButtonLoading({
      ...buttonLoading,
      generate: true,
    });

    const updatedTime = new Date().toISOString();
    const belovedData = contextApiData.beloved.data;

    const belovedCat = {
      primary_co_sampul: {
        data: belovedData.find(
          (b) => b.level === 'primary' && b.type === 'co_sampul'
        ),
        name: 'Primary Co-Sampul',
        isRequired: true,
        inviteStatus: belovedData.find(
          (b) => b.level === 'primary' && b.type === 'co_sampul'
        )?.beloved_invites[0]?.invite_status,
      },
      secondary_co_sampul: {
        data: belovedData.find(
          (b) => b.level === 'secondary' && b.type === 'co_sampul'
        ),
        name: 'Secondary Co-Sampul',
        isRequired: true,
        inviteStatus: belovedData.find(
          (b) => b.level === 'secondary' && b.type === 'co_sampul'
        )?.beloved_invites[0]?.invite_status,
      },
      primary_guardian: {
        data: belovedData.find(
          (b) => b.level === 'primary' && b.type === 'guardian'
        ),
        name: 'Primary Guardian',
        isRequired: false,
      },
      secondary_guardian: {
        data: belovedData.find(
          (b) => b.level === 'secondary' && b.type === 'guardian'
        ),
        name: 'Secondary Guardian',
        isRequired: false,
      },
    };

    const updateData = {
      last_updated: updatedTime,
      nric_name: contextApiData.profile.data?.nric_name,
      co_sampul_1: belovedCat.primary_co_sampul.data?.id ?? null,
      co_sampul_2: belovedCat.secondary_co_sampul.data?.id ?? null,
      guardian_1: belovedCat.primary_guardian.data?.id ?? null,
      guardian_2: belovedCat.secondary_guardian.data?.id ?? null,
    };

    // const approval = {
    //   co_sampul_1_approved: belovedCat.primary_co_sampul.inviteStatus,
    //   co_sampul_2_approved: belovedCat.secondary_co_sampul.inviteStatus,
    // };

    //   if(updateData.co_sampul_1 !== null || updateData.co_sampul_2 !== null){
    //   if (
    //     approval.co_sampul_1_approved == 'accepted' ||
    //     approval.co_sampul_2_approved == 'accepted'
    //   ) {
    //     console.log('isApprove', isApprove);
    //   }
    // }

    const addData = {
      ...updateData,
      will_code: generateWillId(),
    };

    const { data: checkExist, error } = await supabase
      .from('wills')
      .select('*')
      .eq('uuid', contextApiData.user.data?.id)
      .select();

    if (error) {
      setButtonLoading({
        ...buttonLoading,
        generate: false,
      });
      toast.error(error.message);
      return;
    }

    if (checkExist.length > 0) {
      const { data, error } = await supabase
        .from('wills')
        .update({
          ...updateData,
        })
        .eq('uuid', contextApiData.user.data?.id)
        .select()
        .single();

      if (error) {
        setButtonLoading({
          ...buttonLoading,
          generate: false,
        });
        toast.error(error.message);
        return;
      }

      toast.success('Successfully generated!', {
        duration: 5000,
      });
      setButtonLoading({
        ...buttonLoading,
        generate: false,
      });
      getWill();
      fetchWillData();
      setShowAnimation(true);
    } else {
      const { data, error } = await supabase
        .from('wills')
        .insert({
          uuid: contextApiData.user.data?.id,
          ...addData,
        })
        .eq('uuid', contextApiData.user.data?.id)
        .select()
        .single();

      if (error) {
        setButtonLoading({
          ...buttonLoading,
          generate: false,
        });
        toast.error(error.message);
        return;
      }

      toast.success('Successfully generated!', {
        duration: 5000,
      });
      setButtonLoading({
        ...buttonLoading,
        generate: false,
      });
      getWill();
      fetchWillData();
      setShowAnimation(true);
    }
  };

  const downloadCert = async () => {
    setButtonLoading({
      ...buttonLoading,
      download: true,
    });

    var element = document.getElementById('certificate-container');
    let pdf = new jsPDF('p', 'pt', 'a4');

    const contentWidth = element.offsetWidth;
    const contentHeight = element.offsetHeight;
    const scaleX = pdf.internal.pageSize.width / contentWidth;
    const scaleY = pdf.internal.pageSize.height / contentHeight;
    const scale = Math.min(scaleX, scaleY);

    try {
      await new Promise((resolve, reject) => {
        pdf.html(element, {
          html2canvas: {
            scale: scale,
            logging: true,
          },
          callback: function () {
            // This code will run after PDF generation is complete
            pdf.save('will.pdf');
            resolve();
          },
        });
      });
    } catch (error) {
      setButtonLoading({
        ...buttonLoading,
        download: false,
      });
      toast.error(error.message);
    }

    setButtonLoading({
      ...buttonLoading,
      download: false,
    });
  };

  const checkCompleteProfile = () => {
    var is_completed = false;
    if (contextApiData.profile.data?.nric_name) {
      is_completed = true;
    } else {
      is_completed = false;
    }
    return is_completed;
  };

  const showNotCompleteToast = () => {
    toast.error(
      'Complete your profile to begin generating your will. You can do this on the settings page'
    );
  };

  return (
    <>
      {showAnimation && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '50%',
            maxWidth: '400px',
            maxHeight: '400px',
            zIndex: 10,
          }}
        >
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: successWillAnimationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height="100%"
            width="100%"
            eventListeners={[
              {
                eventName: 'complete',
                callback: onAnimationComplete,
              },
            ]}
          />
        </div>
      )}

      <ShareModal url={shareUrl} title="Will Certificate" />
      <div
        class={`${
          router?.pathname == '/dashboard'
            ? 'text-md-start mt-4'
            : 'text-md-end'
        } text-center`}
      >
        <button
          type="button"
          class={`btn ${
            router?.pathname == '/dashboard'
              ? 'btn-light bg-white'
              : 'btn-light'
          } btn-text me-1 mb-1`}
          onClick={() => {
            var is_completed = checkCompleteProfile();
            if (is_completed) {
              $('#share-modal')?.modal('show');
            } else {
              if (router?.pathname == '/view-will') {
                $('#share-modal')?.modal('show');
              } else {
                showNotCompleteToast();
              }
            }
          }}
        >
          {translations[locale].component.will_action_btn.share}
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ms-2"
          >
            <g id="share-04">
              <path
                id="Icon"
                d="M17.5 7.62988L17.5 2.62988M17.5 2.62988H12.5M17.5 2.62988L10.8333 9.29655M8.33333 4.29655H6.5C5.09987 4.29655 4.3998 4.29655 3.86502 4.56903C3.39462 4.80872 3.01217 5.19117 2.77248 5.66157C2.5 6.19635 2.5 6.89642 2.5 8.29655V13.6299C2.5 15.03 2.5 15.7301 2.77248 16.2649C3.01217 16.7353 3.39462 17.1177 3.86502 17.3574C4.3998 17.6299 5.09987 17.6299 6.5 17.6299H11.8333C13.2335 17.6299 13.9335 17.6299 14.4683 17.3574C14.9387 17.1177 15.3212 16.7353 15.5608 16.2649C15.8333 15.7301 15.8333 15.03 15.8333 13.6299V11.7965"
                stroke="#344054"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
        {/* <button
          type="button"
          class={`btn ${
            viewOnly ? 'btn-primary' : 'btn-light '
          } btn-text me-1 mb-1`}
          onClick={() => {
            var is_completed = checkCompleteProfile();
            if (is_completed) {
              if (showQrModal) {
                router.push('will?download=true');
              } else {
                downloadCert();
              }
            } else {
              if (router?.pathname == '/view-will') {
                downloadCert();
              } else {
                showNotCompleteToast();
              }
            }
          }}
        >
          <Loading title="Download PDF" loading={buttonLoading.download} />
        </button> */}
        {viewOnly ? (
          ''
        ) : (
          <button
            type="button"
            class="btn btn-primary btn-text mb-1"
            onClick={() => {
              var is_completed = checkCompleteProfile();
              if (is_completed) {
                generateWill();
              } else {
                showNotCompleteToast();
              }
            }}
          >
            <Loading
              title={
                contextApiData?.profile?.data?.religion == 'islam'
                  ? translations[locale].component.will_action_btn
                      .generate_wasiat
                  : translations[locale].component.will_action_btn.generate_will
              }
              loading={buttonLoading.generate}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              class="ms-2"
            >
              <g clipPath="url(#clip0_158_1895)">
                <path
                  d="M10.8335 1.79651L3.41142 10.7031C3.12075 11.0519 2.97541 11.2263 2.97319 11.3736C2.97126 11.5016 3.02832 11.6234 3.12792 11.7039C3.2425 11.7965 3.46952 11.7965 3.92357 11.7965H10.0002L9.16688 18.4632L16.589 9.55663C16.8797 9.20782 17.025 9.03342 17.0272 8.88612C17.0292 8.75808 16.9721 8.63626 16.8725 8.55576C16.7579 8.46318 16.5309 8.46318 16.0768 8.46318H10.0002L10.8335 1.79651Z"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_158_1895">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0 0.129883)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default WillActionButtons;

// The summary of this page includes:
// This page is designed for managing actions related to generating and sharing will certificates.
// Key functionalities include generating and downloading PDF certificates, sharing URLs, and displaying animations upon successful actions.
// The component dynamically adjusts based on whether it's in view-only mode or interactive mode, ensuring seamless user experience through conditional rendering and state management.
// It emphasizes user profile completeness before allowing generation actions.
