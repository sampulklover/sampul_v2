import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { useUser } from '../context/user';
import { formatTimestamp } from '../utils/helpers';
import DigitalSummaryCard from './DigitalSummaryCard';
import ExtraWishesTable from './ExtraWishesTable';

const WillDetailsCard = ({ willData }) => {
  const { user } = useUser();

  const [belovedDetails, setBelovedDetails] = useState({
    data: null,
    isLoading: false,
  });

  const myWill = willData?.data?.will;
  const myProfile = willData?.data?.will?.profiles;

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
      nric_name:
        belovedDetails.data?.primaryUser?.nric_name ??
        '[PRIMARY CO-SAMPUL NAME]',
      nric_no:
        belovedDetails.data?.primaryUser?.nric_no ??
        '[PRIMARY CO-SAMPUL NRIC NO]',
    },
    secondary_co_sampul: {
      nric_name:
        belovedDetails.data?.secondaryUser?.nric_name ??
        '[SECONDARY CO-SAMPUL NAME]',
      nric_no:
        belovedDetails.data?.secondaryUser?.nric_no ??
        '[SECONDARY CO-SAMPUL NRIC NO]',
    },
    primary_guardian: {
      nric_name:
        belovedDetails.data?.guardianPrimaryUser?.nric_name ??
        '[PRIMARY GUARDIAN NAME]',
      nric_no:
        belovedDetails.data?.guardianPrimaryUser?.nric_no ??
        '[PRIMARY GUARDIAN NRIC NO]',
      isExist: belovedDetails.data?.guardianPrimaryUser?.nric_name
        ? true
        : false,
    },
    secondary_guardian: {
      nric_name:
        belovedDetails.data?.guardianSecondaryUser?.nric_name ??
        '[SECONDARY GUARDIAN NAME]',
      nric_no:
        belovedDetails.data?.guardianSecondaryUser?.nric_no ??
        '[SECONDARY GUARDIAN NRIC NO]',
      isExist: belovedDetails.data?.guardianSecondaryUser?.nric_name
        ? true
        : false,
    },
    additional_request_view:
      user.access_control?.pages?.will?.additional_requests?.access,
  };

  const will_settings = {
    muslim: {
      title: 'WASIAT FOR MY DIGITAL ASSETS',
      info: [
        {
          title: '1. Introduction',
          description: `In the name of Allah, the Most Gracious, the Most Merciful, I, ${myInfo.nric_name}, holding NRIC ${myInfo.nric_no}, residing at ${myInfo.address}, declare this document as my last wasiat, focused on managing my digital assets.`,
        },
        {
          title: '2. Declaration',
          description: `Acknowledging my Muslim faith, I am of sound mind to declare this my final wasiat for my digital assets, written on ${myInfo.last_updated}.`,
        },
        {
          title: '3. Request',
          description: `I urge my family to uphold piety towards Allah S.W.T and fulfill His commands. Upon my passing, my estate must be carefully managed according to Islamic principles. I request my estate as a priority is used to handle funeral expenses and settle debts to Allah S.W.T and humans, including Zakat and other religious obligations as per [Table 1].`,
        },
        {
          title: '4. Cancellation',
          description: `This document supersedes all prior wasiats on digital assets`,
        },
        {
          title: '5. Main Co-Sampul',
          description: `${myInfo.primary_co_sampul.nric_name}, ${myInfo.primary_co_sampul.nric_no} is appointed to safekeep and deliver this wasiat of my digital assets to my beneficiaries.`,
        },
        {
          title: '6. Substitute Co-Sampul',
          description: `If necessary, ${myInfo.secondary_co_sampul.nric_name}, ${myInfo.secondary_co_sampul.nric_no} will act as Substitute Co-Sampul.`,
        },
        {
          title: '7. Digital Assets Distribution',
          description: (
            <div>
              <p>
                Specific Beneficiaries: Certain assets are designated for
                specific beneficiaries or based on Faraid as per [Table 1].
              </p>
              <p>
                Residual Estate: The rest of my digital assets not specifically
                mentioned are to be distributed accordingly either to specific
                beneficiaries or based on Faraid.
              </p>
              <p>
                {myInfo.additional_request_view
                  ? `Additional Requests: For waqaf, sedekah, charity, [Waqaf/Charitable Body] is designated as per [Table 2]`
                  : 'Additional Requests: N/A'}
              </p>
            </div>
          ),
          addBreak: true,
        },
        {
          title: '8. Guardianship',
          description:
            myInfo.primary_guardian.isExist && myInfo.secondary_guardian.isExist
              ? `If my spouse predeceases me or is unable, ${myInfo.primary_guardian.nric_name}, ${myInfo.primary_guardian.nric_no} is appointed for my minor children, with ${myInfo.secondary_guardian.nric_name}, ${myInfo.secondary_guardian.nric_no} as an alternate as per [Table 1]`
              : 'N/A',
        },
        {
          title: '9. Signed by',
          description: `${myInfo.nric_name},
          ${myInfo.nric_no}
          on ${myInfo.last_updated}`,
          addBreak: true,
        },
        {
          title: '10.	Witnesses',
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
              Farhan Hamid
              <br />
              930000020000
              <br />
              Co-Founder, SAMPUL
              <br />
              on {myInfo.last_updated}
            </div>
          ),
        },
      ],
    },
    non_muslim: {
      title: 'LAST WILL AND TESTAMENT FOR DIGITAL ASSETS',
      info: [
        {
          title: '1. Declaration',
          description: `I, ${myInfo.nric_name}, ${myInfo.nric_no}, ${myInfo.address} declare this document, created on ${myInfo.last_updated}, as my Last Will and Testament for my digital assets.`,
        },
        {
          title: '2. Revocation',
          description: `All previous Wills related to my digital assets are revoked.`,
        },
        {
          title: '3. Main Co-Sampul',
          description: `${myInfo.primary_co_sampul.nric_name}, ${myInfo.primary_co_sampul.nric_no} is appointed to safekeep and deliver this Will and Testament of  my digital assets to my beneficiaries.`,
        },
        {
          title: '4. Substitute Co-Sampul',
          description: `If necessary, ${myInfo.secondary_co_sampul.nric_name}, ${myInfo.secondary_co_sampul.nric_no} will act as Substitute Co-Sampul.`,
        },
        {
          title: '5. Digital Assets Distribution',
          description: `
          ● Specific Bequests: Certain assets are designated for specific beneficiaries as per [Table 1].
          ● Residual Estate: The rest of my digital assets not specifically mentioned are to be distributed accordingly.
          ● Additional Bequests: For charity, [Charitable Body] is designated as per [Table 1]`,
          addBreak: true,
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
          title: '8. Signed by',
          description: `${myInfo.nric_name},
          ${myInfo.nric_no}
          on ${myInfo.last_updated}`,
          addBreak: true,
        },
        {
          title: '10.	Witnesses',
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
              Farhan Hamid
              <br />
              930000020000
              <br />
              Co-Founder, SAMPUL
              <br />
              on {myInfo.last_updated}
            </div>
          ),
        },
      ],
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
    if (willData?.data.beloved.length > 0) {
      checkBeloved();
    }
  }, [willData?.data.beloved]);

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
        toast.error('Please setup your Primary or secondary beloved');
      }
    }
  };

  return (
    <>
      <div class="will_details_bg p-4">
        <div class="text-size-medium-wasiat align-center wasit-intro">
          <strong>{will_settings[checkReligion()].title}</strong>
        </div>
        {will_settings[checkReligion()]?.info?.map((item) => {
          return (
            <>
              <div class="wasiat_content first">
                <div class="uui-faq03_question">
                  <div class="wasiat_heading">{item.title}</div>
                </div>
                <div
                  class={`text-size-medium-wasiat ${
                    item?.addBreak ? 'break-text' : ''
                  }`}
                >
                  <span>{item.description}</span>
                </div>
              </div>
              <div class="border-top my-3"></div>
            </>
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
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="text-and-supporting-text-19">
                  <div class="text-and-badge-copy">
                    <div class="smpl_text-lg-semibold">
                      List of Digital Assets
                      <span class="text-span-5">
                        <sup class="superscript">Table-1</sup>
                      </span>
                    </div>
                    <div class="smpl_text-sm-medium text-align-left">
                      List of accounts where you keep your assets.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DigitalSummaryCard
              typeName="all"
              summary={{
                data: willData.data?.digitalAssets,
                isReady: willData.isReady,
              }}
              bodyList={{
                data: willData.data?.bodies,
                isReady: willData.isReady,
              }}
              showBeloved={true}
              belovedData={willData.data?.beloved}
            />
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
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                        stroke="#3118D3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="text-and-supporting-text-19">
                  <div class="text-and-badge-copy">
                    <div class="smpl_text-lg-semibold">
                      List of Additional Bequests
                      <span class="text-span-5">
                        <sup class="superscript">Table-2</sup>
                      </span>
                    </div>
                    <div class="smpl_text-sm-medium text-align-left">
                      List of additional requests.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ExtraWishesTable
              typeName="extra_wishes"
              summary={{
                data: willData.data,
                isReady: willData.isReady,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WillDetailsCard;
