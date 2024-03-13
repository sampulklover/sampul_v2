import { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';
import { jsPDF } from 'jspdf';
import { replaceOrAddImage } from '../utils/helpers';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';
import Loading from './Laoding';

const WillActionButtons = ({
  setQrValue,
  cardRef,
  showQrModal = false,
  viewOnly = false,
  refreshFunction,
}) => {
  const { user } = useUser();
  const router = useRouter();

  const [shareUrl, setShareUrl] = useState(null);
  const [buttonLoading, setButtonLoading] = useState({
    generate: false,
    download: false,
  });

  useEffect(() => {
    function shouldRunReadyFunction() {
      if (viewOnly) {
        return router.isReady;
      } else {
        return router.isReady && user?.uuid;
      }
    }

    if (shouldRunReadyFunction()) {
      readyFunction();
    }
  }, [router.isReady, user, viewOnly]);

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
        .eq('uuid', user?.uuid);

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

  const options = {
    allowTaint: true,
    useCORS: true,
    backgroundColor: 'rgba(0,0,0,0)',
    removeContainer: true,
  };

  const generateWillId = () => {
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(Math.random() * 10000000000);
    const randomId = `SMPL-${currentYear}-${randomDigits
      .toString()
      .padStart(10, '0')}`;

    return randomId;
  };

  const handleGenerate = async (data) => {
    var will_id = data.will_code;
    var url = `${process.env.NEXT_PUBLIC_HOST}/view-will?id=${will_id}`;
    await setQrValue(url);

    const cardElement = cardRef.current;
    if (!cardElement) return;
    try {
      const html2canvas = await import('html2canvas');

      const result = await html2canvas.default(cardElement, options);

      setTimeout(async () => {
        const asURL = result.toDataURL();

        const timestamp = new Date().getTime();
        var file = dataURLtoFile(asURL, `qr_code_${will_id}_${timestamp}.png`);
        if (file) {
          await replaceOrAddImage({
            userId: user?.uuid,
            returnData: data,
            directory: `/will/`,
            imageInput: {
              files: [file],
            },
            dataBase: 'wills',
            isUpdateByReturnId: false,
          });

          setShareUrl(url);
          refreshFunction();
          setButtonLoading({
            ...buttonLoading,
            generate: false,
          });
          toast.success('Successfully generated!');
        } else {
          setButtonLoading({
            ...buttonLoading,
            generate: false,
          });
          toast.error('Something went wrong, please try again');
        }
      }, 1000);
    } catch (error) {
      setButtonLoading({
        ...buttonLoading,
        generate: false,
      });
      toast.error('Something went wrong, please try again');
    }
  };

  const generateQRCode = async (data) => {
    if (showQrModal) {
      setTimeout(() => {
        $('#qr-code-modal')?.modal('show');
        setTimeout(() => {
          handleGenerate(data);
        }, 1000);
      }, 500);
    } else {
      handleGenerate(data);
    }
  };

  function dataURLtoFile(dataURL, filename) {
    try {
      var arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch {
      return null;
    }
  }

  const generateWill = async () => {
    setButtonLoading({
      ...buttonLoading,
      generate: true,
    });

    const updatedTime = new Date().toISOString();

    const { data: beloved, error: errorBeloved } = await supabase
      .from('beloved')
      .select('*')
      .eq('uuid', user?.uuid)
      .select();

    if (errorBeloved) {
      setButtonLoading({
        ...buttonLoading,
        generate: false,
      });
      toast.error(errorBeloved.message);
      return;
    }

    const belovedCat = {
      primary_co_sampul: {
        data: beloved.filter(
          (b) => b.level === 'primary' && b.type === 'co_sampul'
        ),
        name: 'Primary Co-Sampul',
        isRequired: true,
      },
      secondary_co_sampul: {
        data: beloved.filter(
          (b) => b.level === 'secondary' && b.type === 'co_sampul'
        ),
        name: 'Secondary Co-Sampul',
        isRequired: true,
      },
      primary_guardian: {
        data: beloved.filter(
          (b) => b.level === 'primary' && b.type === 'guardian'
        ),
        name: 'Primary Guardian',
        isRequired: false,
      },
      secondary_guardian: {
        data: beloved.filter(
          (b) => b.level === 'secondary' && b.type === 'guardian'
        ),
        name: 'secondary Guardian',
        isRequired: false,
      },
    };

    const updateData = {
      last_updated: updatedTime,
      nric_name: user.profile.nric_name,
      co_sampul_1: belovedCat.primary_co_sampul.data[0]?.id ?? null,
      co_sampul_2: belovedCat.secondary_co_sampul.data[0]?.id ?? null,
      guardian_1: belovedCat.primary_guardian.data[0]?.id ?? null,
      guardian_2: belovedCat.secondary_guardian.data[0]?.id ?? null,
    };

    const addData = {
      ...updateData,
      will_code: generateWillId(),
    };

    const { data: checkExist, error } = await supabase
      .from('wills')
      .select('*')
      .eq('uuid', user?.uuid)
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
        .eq('uuid', user?.uuid)
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

      await generateQRCode(data);
    } else {
      const { data, error } = await supabase
        .from('wills')
        .insert({
          uuid: user?.uuid,
          ...addData,
        })
        .eq('uuid', user?.uuid)
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

      await generateQRCode(data);
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
    if (user?.profile?.nric_name) {
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
      <ShareModal url={shareUrl} title="Will Certificate" />
      <div
        class={`text-md-right ${
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
          } btn-text btn-lg me-1 mb-1`}
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
          Share
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
          } btn-text btn-lg me-1 mb-1`}
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
            class="btn btn-primary btn-text btn-lg mb-1"
            onClick={() => {
              var is_completed = checkCompleteProfile();
              if (is_completed) {
                generateWill();
              } else {
                showNotCompleteToast();
              }
            }}
          >
            <Loading title="Generate Wasiat" loading={buttonLoading.generate} />
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
