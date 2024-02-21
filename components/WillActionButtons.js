import { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';
import { jsPDF } from 'jspdf';
import { replaceOrAddImage } from '../utils/helpers';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';

const WillActionButtons = ({ setQrValue, cardRef, showQrModal = false }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [runEffect, setRunEffect] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  useEffect(() => {
    if (!runEffect && user.uuid !== null) {
      setRunEffect(true);
      fetchWillData();

      const download = router.query.download === 'true';
      if (download) {
        setTimeout(() => {
          downloadCert();
        }, 1000);
      }
    }
  }, [user, runEffect]);

  const fetchWillData = async () => {
    const { data, error } = await supabase
      .from('wills')
      .select(`*, profiles ( * )`)
      .eq('uuid', user.uuid)
      .single();

    if (error) {
      toast.error(error.message);
    }

    if (data.will_code) {
      var url = `${process.env.NEXT_PUBLIC_HOST}/view-will?id=${data.will_code}`;
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
      const asURL = result.toDataURL();
      const timestamp = new Date().getTime();
      var file = dataURLtoFile(asURL, `qr_code_${will_id}_${timestamp}.png`);

      await replaceOrAddImage({
        userId: user.uuid,
        returnData: data,
        directory: `/will/`,
        imageInput: {
          files: [file],
        },
        dataBase: 'wills',
        isUpdateByReturnId: false,
      });

      setShareUrl(url);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const generateQRCode = async (data) => {
    if (showQrModal) {
      await $('#qr-code-modal')?.modal('show');
      setTimeout(() => {
        handleGenerate(data);
      }, 1000);
    } else {
      handleGenerate(data);
    }
  };

  function dataURLtoFile(dataURL, filename) {
    var arr = dataURL.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const generateWill = async () => {
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
      .eq('uuid', user.uuid)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    }

    if (checkExist) {
      const { data, error } = await supabase
        .from('wills')
        .update({
          ...updateData,
        })
        .eq('uuid', user.uuid)
        .select()
        .single();

      generateQRCode(data);

      if (error) {
        toast.error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('wills')
        .upsert({
          uuid: user.uuid,
          ...addData,
        })
        .eq('uuid', user.uuid)
        .select()
        .single();

      generateQRCode(data);

      if (error) {
        toast.error(error.message);
      }
    }
  };

  const downloadCert = async () => {
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
      toast.error(error.message);
    }
  };

  return (
    <>
      <ShareModal url={shareUrl} title="Will Certificate" />
      <div class="text-md-right text-center">
        <button
          type="button"
          class="btn btn-light btn-text btn-lg me-1 mb-1"
          onClick={() => {
            $('#share-modal')?.modal('show');
          }}
        >
          Share
        </button>
        <button
          type="button"
          class="btn btn-light btn-text btn-lg me-1 mb-1"
          onClick={() => {
            if (showQrModal) {
              router.push('will?download=true');
            } else {
              downloadCert();
            }
          }}
        >
          Download PDF
        </button>
        <button
          type="button"
          class="btn btn-primary btn-text btn-lg mb-1"
          onClick={() => {
            generateWill();
          }}
        >
          Generate Wasiat
        </button>
      </div>
    </>
  );
};

export default WillActionButtons;
