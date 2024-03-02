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
  const { user, isLoading } = useUser();
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

    const updateData = {
      last_updated: updatedTime,
      nric_name: user.profile.nric_name,
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

      await generateQRCode(data);

      if (error) {
        setButtonLoading({
          ...buttonLoading,
          generate: false,
        });
        toast.error(error.message);
      }
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

      await generateQRCode(data);

      if (error) {
        setButtonLoading({
          ...buttonLoading,
          generate: false,
        });
        toast.error(error.message);
      }
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
      <div class="text-md-right text-center">
        <button
          type="button"
          class="btn btn-light btn-text btn-lg me-1 mb-1"
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
        </button>
        <button
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
        </button>
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
          </button>
        )}
      </div>
    </>
  );
};

export default WillActionButtons;
