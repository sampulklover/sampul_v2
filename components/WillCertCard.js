import Loading from './Laoding';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

const WillCertCard = ({ willData }) => {
  const will_settings = {
    muslim: {
      title: 'Wasiat',
      from: `ditulis oleh`,
      info: `Salinan sijil dan perincian penuh wasiat boleh didapati dalam peti simpanan digital Sampul. Sebarang maklumat dan pertanyaan, sila emel kepada ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    },
    non_muslim: {
      title: 'Will and Testament for Digital Asset',
      from: 'of',
      info: `A copy of this certificate & details of the will is stored in Sampul digital vault. For queries and info please email ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    },
  };

  const myInfo = {
    isDraft: willData.data.will?.is_draft,
    nric_name: willData.data.will?.nric_name
      ? willData.data.will.nric_name
      : '[YOUR NAME]',
    will_code: willData.data.will?.will_code
      ? willData.data.will.will_code
      : '[ID]',
    qrValue: willData.data.will?.will_code
      ? `${process.env.NEXT_PUBLIC_HOST}/view-will?id=${willData.data.will.will_code}`
      : null,
  };

  const checkReligion = () => {
    var display = 'muslim';

    if (willData.data.will?.profiles?.religion) {
      if (willData.data.will.profiles.religion == 'islam') {
        display = 'muslim';
      } else {
        display = 'non_muslim';
      }
    }

    return display;
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
              <img alt="image" loading="lazy" src="/images/Logo.svg"></img>
            </div>
            {/* {myInfo.isDraft == false ? (
              <></>
            ) : (
              <img
                loading="lazy"
                src="/images/draft-rubber-stamp.png"
                style={{
                  maxWidth: '30%',
                }}
                class="draft-image"
              ></img>
            )} */}

            <div class="wasiat-cert_content-centre">
              <h2 class="heading-xsmall centre">
                {will_settings[checkReligion()].title}
              </h2>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">
                {will_settings[checkReligion()].from}
              </div>
              <div class="space-medium"></div>
              <div class="heading-xsmall centre text--color-sampul">
                <span>{myInfo.nric_name}</span>
              </div>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">
                Will ID :{' '}
                <span id="view-certificate-will-code">{myInfo.will_code}</span>
              </div>
              <div class="space-xxsmall"></div>
              <div class="text-size-medium centre">
                Securing Digital Legacies {process.env.NEXT_PUBLIC_HOST}
              </div>
              <div class="space-medium"></div>
              <div class="text-size-medium centre">
                {will_settings[checkReligion()].info}
              </div>
              <div class="bar-divider"></div>
            </div>
            <div class="wasiat-cert_content-bottom">
              {myInfo.qrValue !== null ? (
                <QRCode
                  title="Sampul"
                  value={myInfo.qrValue}
                  bgColor={'#FFFFFF'}
                  fgColor={'#000000'}
                  size={150}
                  onClick={() => {
                    window.open(myInfo.qrValue, '_blank');
                  }}
                />
              ) : (
                <img
                  width="150"
                  loading="lazy"
                  src={`${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${willData.data.will?.image_path}`}
                  alt=""
                />
              )}
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

export default WillCertCard;

// The summary of this page includes:
// This page designed to generates a digital certificate for wills.
// It's dynamically render content based on whether the will owner is Muslim or not.
// The certificate includes personalized details such as the owner's name and will ID,
// and it offers a QR code for easy access to the digital asset's details.
