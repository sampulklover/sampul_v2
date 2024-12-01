import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { formatTimestamp } from '../utils/helpers';
import DigitalSummaryCard from './DigitalSummaryCard';
import ExtraWishesTable from './ExtraWishesTable';
import Loading from './Laoding';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WillDetailsCard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();

  const willData = {
    data: {
      will: contextApiData.will.data,
      beloved: contextApiData.beloved.data,
      digitalAssets: contextApiData.digitalAssets.data,
      extraWishes: contextApiData.extraWishes.data,
      bodies: contextApiData.bodies.data,
    },
  };

  const [belovedDetails, setBelovedDetails] = useState({
    data: null,
    isLoading: false,
  });

  const myWill = willData.data.will;
  const myProfile = willData.data.will?.profiles;
  const myExtraWishes = willData.data.extraWishes;

  const myInfo = {
    last_updated: formatTimestamp(myWill?.last_updated),
    nric_name: myWill?.nric_name ?? '[YOUR NAME]',
    nric_no: myProfile?.nric_no ?? '[NRIC NO]',
    address: myProfile?.address_1
      ? `${myProfile?.address_1}, ${
          myProfile?.address_2
            ? `${myProfile.address_2}, ${myProfile?.city}`
            : myProfile?.city
        } , ${myProfile?.country} 
    `
      : '[ADDRESS]',
    primary_co_sampul: {
      name:
        belovedDetails?.data?.primaryUser?.beloved_invites?.[0]?.invited_profile
          ?.nric_name || '[PRIMARY CO-SAMPUL NAME/NICKNAME]',
      nric_no:
        belovedDetails?.data?.primaryUser?.beloved_invites?.[0]?.invited_profile
          ?.nric_no || '[PRIMARY CO-SAMPUL NRIC NO]',
      email:
        belovedDetails.data?.primaryUser?.email ?? '[PRIMARY CO-SAMPUL EMAIL]',
    },
    secondary_co_sampul: {
      name:
        belovedDetails?.data?.secondaryUser?.beloved_invites?.[0]
          ?.invited_profile?.nric_name || '[SECONDARY CO-SAMPUL NAME/NICKNAME]',
      nric_no:
        belovedDetails?.data?.secondaryUser?.beloved_invites?.[0]
          ?.invited_profile?.nric_no || '[SECONDARY CO-SAMPUL NRIC NO]',
      email:
        belovedDetails.data?.secondaryUser?.email ??
        '[SECONDARY CO-SAMPUL EMAIL]',
    },
    primary_guardian: {
      name:
        belovedDetails.data?.guardianPrimaryUser?.name ??
        '[PRIMARY GUARDIAN NAME]',
      // nric_no:
      //   belovedDetails.data?.guardianPrimaryUser?.nric_no ??
      //   '[PRIMARY GUARDIAN NRIC NO]',
      email:
        belovedDetails.data?.guardianPrimaryUser?.email ??
        '[PRIMARY GUARDIAN EMAIL]',
      isExist: belovedDetails.data?.guardianPrimaryUser?.name ? true : false,
    },
    secondary_guardian: {
      name:
        belovedDetails.data?.guardianSecondaryUser?.name ??
        '[SECONDARY GUARDIAN NAME]',
      // nric_no:
      //   belovedDetails.data?.guardianSecondaryUser?.nric_no ??
      //   '[SECONDARY GUARDIAN NRIC NO]',
      email:
        belovedDetails.data?.guardianSecondaryUser?.email ??
        '[SECONDARY GUARDIAN EMAIL]',
      isExist: belovedDetails.data?.guardianSecondaryUser?.name ? true : false,
    },
    additional_request_view:
      contextApiData.account.data?.products?.access_control?.pages?.will
        ?.additional_requests?.access,
    extra_wishes: {
      nazar: {
        title: myExtraWishes?.nazar_wishes ?? '-',
        amount: `RM ${
          myExtraWishes?.nazar_est_cost_myr
            ? myExtraWishes.nazar_est_cost_myr
            : 0
        }`,
      },
      fidyah: {
        dayLeft: myExtraWishes?.fidyah_fast_left_days
          ? myExtraWishes?.fidyah_fast_left_days
          : 0,
        amount: `RM ${
          myExtraWishes?.fidyah_amout_due_myr
            ? myExtraWishes.fidyah_amout_due_myr
            : 0
        }`,
      },
      organDonor: {
        agree: myExtraWishes?.organ_donor_pledge ? true : false,
      },
    },
  };

  const will_settings = {
    muslim: {
      title: 'WASIAT ASET SAYA',
      info: [
        {
          title: '1. Mukaddimah',
          description: `Dengan nama Allah, Yang Maha Pengasih, Lagi Maha Penyayang, saya, ${myInfo.nric_name}, memegang NRIC ${myInfo.nric_no}, bermastautin di ${myInfo.address}, mengisytiharkan dokumen ini sebagai wasiat terakhir saya, memberi tumpuan kepada pengurusan aset saya.`,
        },
        {
          title: '2. Pengisytiharan',
          description: `Mengakui kepercayaan Islam saya, saya berazam untuk mengisytiharkan wasiat terakhir saya untuk aset saya, yang ditulis pada ${myInfo.last_updated}.`,
        },
        {
          title: '3. Permintaan',
          description: `Saya menyeru keluarga saya untuk menegakkan ketaqwaan kepada Allah S.W.T dan menunaikan perintah-Nya. Apabila saya meninggal dunia, harta saya hendaklah diuruskan dengan teliti mengikut prinsip Islam. Saya memohon harta pusaka saya sebagai keutamaan digunakan untuk mengendalikan perbelanjaan pengebumian dan menyelesaikan hutang kepada Allah S.W.T dan manusia, termasuk Zakat dan kewajipan agama lain.`,
        },
        {
          title: '4. Pembatalan',
          description: `Dokumen ini menggantikan semua wasiat terdahulu pada aset.`,
        },
        {
          title: '5. Co-Sampul Utama',
          description: `${myInfo.primary_co_sampul.name}, ${myInfo.primary_co_sampul.nric_no} dilantik untuk menyimpan dan menyampaikan wasiat aset saya ini kepada waris saya.`,
        },
        {
          title: '6. Co-Sampul Ganti',
          description: `Jika perlu, ${myInfo.secondary_co_sampul.name}, ${myInfo.secondary_co_sampul.nric_no} akan bertindak sebagai Co-Sampul Ganti.`,
        },
        {
          title: '7. Penyelesaian Hutang dan Tanggungjawab Berkaitan Hutang',
          description: (
            <div>
              <p>
                Saya berharap waris tersayang saya akan melunaskan hutang-hutang
                saya yang tidak mempunyai perlindungan Takaful seperti yang
                disenaraikan dalam Jadual 1 dan juga melunaskan tanggungjawab
                berkaitan hutang yang lain seperti Nazar/Kaffarah/Fidyah saya
                yang berbaki yang tidak sempat saya sempurnakan ketika hidup dan
                diambil daripada harta pusaka saya seperti berikut:
              </p>
              <ul>
                <li>
                  Nazar/Kaffarah: {myInfo.extra_wishes.nazar.title}
                  <br />
                  Anggaran Kos: {myInfo.extra_wishes.nazar.amount}
                </li>
                <li>
                  Fidyah: {myInfo.extra_wishes.fidyah.dayLeft} hari Anggaran
                  <br />
                  Kos: {myInfo.extra_wishes.fidyah.amount}
                </li>
                <li>
                  Derma Organ: Saya dengan ini{' '}
                  {myInfo.extra_wishes.organDonor.agree
                    ? 'bersetuju'
                    : 'tidak bersetuju'}{' '}
                  sebagai penderma organ.
                </li>
              </ul>
              {/* <p>
                {myInfo.additional_request_view
                  ? `Wasiat Tambahan: Untuk waqaf, sedekah, sedekah, [Waqaf/Badan Amal] ditetapkan mengikut [Jadual 2]`
                  : 'Wasiat Tambahan: N/A'}
              </p>{' '} */}
            </div>
          ),
          addBreak: true,
        },
        {
          title:
            '8. Penjelasan Kos Pentadbiran Harta Pusaka dan Agihan Pendahuluan',
          description: (
            <div>
              <p>
                Saya membenarkan waris saya setelah melantik pentadbir atau
                pemegang amanah atau Wasi untuk menjelaskan segala perbelanjaan
                bagi pentadbiran harta pusaka daripada harta pusaka saya. Saya
                juga membenarkan sekiranya perlu dikeluarkan satu jumlah yang
                muhasabah sebagai nafkah perbelanjaan bulanan bagi waris di
                bawah tanggungan saya dan jumlah itu ditolak daripada bahagian
                harta pusaka yang akan diterima oleh waris saya semasa agihan
                akhir sekiranya proses tuntutan pusaka mengambil masa yang lama
                daripada sepatutnya.
              </p>
            </div>
          ),
          addBreak: true,
        },
        {
          title: '9. Pengagihan Aset ',
          description: (
            <div>
              <p>
                Sehingga ⅓: Aset tertentu kepada bukan waris atau disedekahkan
                atau diwaqafkan kepada pihak tertentu seperti di [Jadual 2].
              </p>
              <p>
                Penerima Hadiah (Hibah): Aset tertentu ditetapkan untuk penerima
                tertentu secara terus tertakluk kepada persetujuan waris Faraid
                yang berhak seperti di [Jadual 1]
              </p>
              <p>
                Faraid: Aset tertentu ditetapkan untuk penerima tertentu
                berdasarkan pembahagian Faraid seperti di [Jadual 1].
              </p>
              <p>
                Baki Harta: Selebihnya aset saya yang tidak dinyatakan secara
                khusus akan diagihkan sewajarnya sama ada kepada penerima
                tertentu tertakluk kepada persetujuan waris Faraid atau
                berdasarkan pembahagian Faraid.
              </p>
            </div>
          ),
        },
        {
          title: '10. Penjagaan Anak',
          description:
            myInfo.primary_guardian.isExist == false &&
            myInfo.secondary_guardian.isExist == false
              ? 'N/A'
              : `Jika pasangan saya meninggal dunia sebelum saya atau tidak berkemampuan, ${myInfo.primary_guardian.name}, beralamatkan email ${myInfo.primary_guardian.email} dilantik untuk anak-anak saya yang masih di bawah umur, dengan ${myInfo.secondary_guardian.name}, beralamatkan email ${myInfo.secondary_guardian.email} sebagai pengganti seperti [Jadual 1].`,
        },
        {
          title: '11.	Saksi',
          description: (
            <div>
              <strong>Diperakui oleh</strong>
              <br />
              Muhammad Arham Munir Merican bin Amir Feisal Merican
              <br />
              931011875001
              <br />
              Pengasas, SAMPUL
              <br />
              pada {myInfo.last_updated}
              <br />
              <br />
              <strong>Diperakui oleh</strong>
              <br />
              Mohammad Aiman bin Sulaiman
              <br />
              871013875003
              <br />
              Pengasas Bersama, SAMPUL
              <br />
              pada {myInfo.last_updated}
            </div>
          ),
        },
        {
          title: '12.	Tanda Tangan',
          description: (
            <div>
              <strong>Disediakan oleh</strong>
              <br />
              <br />
              <br />
              <br />
              ____________________
              <br />
              {myInfo.nric_name}
              <br />
              {myInfo.nric_no}
              <br />
              pada {myInfo.last_updated}
              <br />
              <br />
              <small>
                <i>
                  Walaupun platform kami menyediakan perkhidmatan digital untuk
                  membuat wasiat, kami amat menggalakkan anda mencetak wasiat
                  yang telah dilengkapkan dan menandatanganinya secara fizikal
                  untuk simpanan peribadi anda. Sekiranya timbul sebarang
                  pertikaian pada masa hadapan, salinan wasiat yang
                  ditandatangani secara fizikal akan memberikan kepastian
                  undang-undang. Salinan bercetak dan bertandatangan ini boleh
                  bertindak sebagai sandaran kepada rekod digital anda.
                </i>
              </small>
            </div>
          ),
        },
      ],
      table: {
        table_1: {
          title: 'Jadual 1',
        },
        table_2: {
          title: 'Jadual 2',
        },
      },
    },
    non_muslim: {
      title: 'LAST WILL AND TESTAMENT FOR ASSETS',
      info: [
        {
          title: '1. Declaration',
          description: `I, ${myInfo.nric_name}, ${myInfo.nric_no}, ${myInfo.address} declare this document, created on ${myInfo.last_updated}, as my Last Will and Testament for my assets.`,
        },
        {
          title: '2. Revocation',
          description: `All previous Wills related to my assets are revoked.`,
        },
        {
          title: '3. Main Co-Sampul',
          description: `${myInfo.primary_co_sampul.name}, ${myInfo.primary_co_sampul.nric_no} is appointed to safekeep and deliver this Will and Testament of  my assets to my beneficiaries.`,
        },
        {
          title: '4. Substitute Co-Sampul',
          description: `If necessary, ${myInfo.secondary_co_sampul.name}, ${myInfo.secondary_co_sampul.nric_no} will act as Substitute Co-Sampul.`,
        },
        {
          title: '5. Assets Distribution',
          description: (
            <div>
              <p>
                Specific Bequests: Certain assets are designated for specific
                beneficiaries as per [Table 1].
              </p>
              <p>
                Residual Estate: The rest of my assets not specifically
                mentioned are to be distributed accordingly.
              </p>
              <p>
                Additional Bequests: For charity, [Charitable Body] is
                designated as per [Table 2]
              </p>
              <p>
                Organ Donation: I hereby{' '}
                {myInfo.extra_wishes.organDonor.agree ? 'Agree' : 'Disagree'} to
                donate my organ at the point of demise.
              </p>
            </div>
          ),
        },
        {
          title: '6. Guardianship',
          description: `If my spouse/partner predeceases me or is unable, [Guardian Name], [IC] is appointed for my minor children, with [Guardian Name 2] [IC] as an alternate as per [Table 1]`,
        },
        {
          title: '7. Predecease Condition',
          description: `If any beneficiary predeceases me, their share shall be redistributed among the remaining beneficiaries or as specified in this Will.`,
        },
        {
          title: '8.	Witnesses',
          description: (
            <div>
              <strong>Signed by</strong>
              <br />
              Muhammad Arham Munir Merican bin Amir Feisal Merican
              <br />
              931011875001
              <br />
              Founder, SAMPUL
              <br />
              on {myInfo.last_updated}
              <br />
              <br />
              <strong>Signed by</strong>
              <br />
              Mohammad Aiman bin Sulaiman
              <br />
              871013875003
              <br />
              Co-Founder, SAMPUL
              <br />
              on {myInfo.last_updated}
            </div>
          ),
        },
        {
          title: '9.	Signature',
          description: (
            <div>
              <strong>Signed by</strong>
              <br />
              <br />
              <br />
              <br />
              ________________
              <br />
              {myInfo.nric_name}
              <br />
              {myInfo.nric_no}
              <br />
              on {myInfo.last_updated}
              <br />
              <br />
              <small>
                <i>
                  While our platform provides a digital service for creating
                  wills, we strongly recommend that you print out your completed
                  will and sign it physically for your personal safekeeping. In
                  the event of any potential disputes, a physically signed copy
                  of your will shall provide legal certainty. This printed and
                  signed version can serve as a tangible backup to your digital
                  records.
                </i>
              </small>
            </div>
          ),
        },
      ],
      table: {
        table_1: {
          title: 'Table 1',
        },
        table_2: {
          title: 'Table 2',
        },
      },
    },
  };

  const checkReligion = () => {
    var display = 'muslim';

    if (willData?.data?.will?.profiles?.religion) {
      if (willData.data.will.profiles.religion == 'islam') {
        display = 'muslim';
      } else {
        display = 'non_muslim';
      }
    }

    return display;
  };

  useEffect(() => {
    if (willData.data.beloved?.length > 0) {
      checkBeloved();
    }
  }, [willData.data.beloved]);

  const checkBeloved = () => {
    if (willData?.data.beloved.length !== 0) {
      var primaryUser = {};
      var secondaryUser = {};
      var guardianPrimaryUser = {};
      var guardianSecondaryUser = {};

      willData?.data.beloved.map((item) => {
        if (item.type == 'co_sampul' && item.level == 'primary') {
          primaryUser = item;
        }
        if (item.type == 'co_sampul' && item.level == 'secondary') {
          secondaryUser = item;
        }
        if (item.type == 'guardian' && item.level == 'primary') {
          guardianPrimaryUser = item;
        }
        if (item.type == 'guardian' && item.level == 'secondary') {
          guardianSecondaryUser = item;
        }
      });

      if (primaryUser && secondaryUser) {
        setBelovedDetails({
          ...belovedDetails,
          data: {
            primaryUser: primaryUser,
            secondaryUser: secondaryUser,
            guardianPrimaryUser: guardianPrimaryUser,
            guardianSecondaryUser: guardianSecondaryUser,
          },
        });
      } else {
        toast.error(
          translations[locale].component.will_details_card.please_setup_your_
        );
      }
    }
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

    const element = document.getElementById('certificate-details-container');

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
      const bottomMargin = 50; // Adjust bottom margin as needed
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

      pdf.save('Details.pdf');
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
          <Loading title="Download Details" loading={buttonLoading.download} />
        </button>
      </div>
      <div class="will_details_bg" id="certificate-details-container">
        <div class="text-size-medium-wasiat align-center wasit-intro">
          <strong>{will_settings[checkReligion()].title}</strong>
        </div>
        {will_settings[checkReligion()]?.info?.map((item, index, array) => {
          return (
            <div key={index}>
              <div className="wasiat_content first">
                <div className="uui-faq03_question">
                  <div className="wasiat_heading">{item.title}</div>
                </div>
                <div
                  className={`text-size-medium-wasiat ${
                    item?.addBreak ? 'break-text' : ''
                  }`}
                >
                  <span>{item.description}</span>
                </div>
              </div>
              <div
                className="border-top"
                style={{
                  display: index === array.length - 1 ? 'none' : 'block',
                }}
              ></div>
            </div>
          );
        })}
      </div>

      <div class="mt-3">
        <div>
          <div class="content_overview_digital-subscribtions">
            <div class="card-header-2">
              <div class="content-33">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="text-and-supporting-text-19">
                  <div class="text-and-badge-copy">
                    <div class="smpl_text-lg-semibold">
                      {
                        translations[locale].component.will_details_card
                          .list_of_digital_
                      }
                      <span class="text-span-5">
                        <sup class="superscript">
                          {will_settings[checkReligion()].table.table_1.title}
                        </sup>
                      </span>
                    </div>
                    <div class="smpl_text-sm-medium text-align-left">
                      {
                        translations[locale].component.will_details_card
                          .list_of_accounts_
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DigitalSummaryCard typeName="all" showBeloved={false} />
          </div>
        </div>
        <div>
          <div class="content_overview_digital-subscribtions mt-3">
            <div class="card-header-2">
              <div class="content-33">
                <div class="smpl-icon-featured-outline-large">
                  <div class="icon-featured-medium w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="text-and-supporting-text-19">
                  <div class="text-and-badge-copy">
                    <div class="smpl_text-lg-semibold">
                      {
                        translations[locale].component.will_details_card
                          .list_of_additional_
                      }
                      <span class="text-span-5">
                        <sup class="superscript">
                          {will_settings[checkReligion()].table.table_2.title}
                        </sup>
                      </span>
                    </div>
                    <div class="smpl_text-sm-medium text-align-left">
                      {
                        translations[locale].component.will_details_card
                          .list_of_additional_
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ExtraWishesTable typeName="extra_wishes" />
          </div>
        </div>
      </div>
    </>
  );
};

export default WillDetailsCard;

// The summary of this page includes:
// This page is designed to manage and display details from a user's digital will.
// It fetches data through an API and organizes information such as the user's personal details, guardianship preferences, and specific wishes for digital assets.
// Depending on the user's religion, it formats the content accordingly, emphasizing Islamic or non-Islamic legal principles.
// The component includes sections for primary and secondary co-sampul (trusted individuals), organ donation preferences, and additional requests like charity allocations.
// It uses formatted timestamps and various helper functions to present comprehensive information relevant to digital asset management after the user's demise.
