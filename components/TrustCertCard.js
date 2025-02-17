import Loading from './Laoding';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

const TrustCertCard = ({ trustData }) => {
  const myInfo = {
    isDraft: null,
    nric_name: null ? null : '[YOUR NAME]',
    will_code: trustData?.trust_code ? trustData.trust_code : '[ID]',
    qrValue: null ? null : null,
  };

  const [buttonLoading, setButtonLoading] = useState({
    generate: false,
    download: false,
  });

  const downloadCert = async () => {
    setButtonLoading({
      ...buttonLoading,
      download: true,
    });

    const element = document.getElementById('certificate-container');

    if (!element) {
      toast.error('Container not found!');
      setButtonLoading({
        ...buttonLoading,
        download: false,
      });
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const bottomMargin = 20; // Adjust bottom margin as needed
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(
          imgData,
          'PNG',
          0,
          position + bottomMargin,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
        position -= pageHeight;

        if (heightLeft > 0) {
          pdf.addPage();
        }
      }

      pdf.save('Certificate.pdf');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setButtonLoading({
        ...buttonLoading,
        download: false,
      });
    }
  };

  return (
    <>
      <div class="text-end">
        <button
          type="button"
          class={`btn btn-light btn-text me-1 mb-1`}
          onClick={() => {
            downloadCert();
          }}
        >
          <Loading
            title="Download Certificate"
            loading={buttonLoading.download}
          />
        </button>
      </div>
      <div class="wasiat-cert-preview" id="certificate-container">
        <div class="wasiat-cert_content p-3">
          <div class="wasiat-cert_wrapper">
            <div
              class={`wasiat-cert_content-top ${myInfo.isDraft ? 'pt-0' : ''}`}
            >
              <img
                alt="image"
                loading="lazy"
                src="/images/logo-power-by-rakyat-trustee.svg"
              ></img>
            </div>
            <div class="wasiat-cert_content-centre">
              <h2 class="heading-xsmall centre">Surat Ikatan Amanah</h2>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">antara</div>
              <div class="space-medium"></div>
              <div class="heading-xsmall centre text--color-sampul">
                <span>{myInfo.nric_name}</span>
              </div>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">
                ID :{' '}
                <span id="view-certificate-will-code">{myInfo.will_code}</span>
              </div>
              <div class="space-xxsmall"></div>
              <div class="text-size-medium centre">
                 Pembuat Amanah seperti yang disenaraikan di bawah Jadual
                Pertama  (“Pembuat Amanah”) 
              </div>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">dan</div>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">
                Salinan sijil dan perincian penuh wasiat boleh didapati dalam
                peti simpanan digital Sampul. <br />
                Sebarang maklumat dan pertanyaan, sila emel kepada
                hello@sampul.co
              </div>
              <div class="bar-divider"></div>
            </div>
            <div class="wasiat-cert_content-bottom">
              <div class="wasiat-cert_content-centre">
                <div class="space-xxsmall"></div>
                <div class="text-size-medium centre">Powered by Sampul</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrustCertCard;

// The summary of this page includes:
// This page designed to generates a digital certificate for wills.
// It's dynamically render content based on whether the will owner is Muslim or not.
// The certificate includes personalized details such as the owner's name and will ID,
// and it offers a QR code for easy access to the digital asset's details.
