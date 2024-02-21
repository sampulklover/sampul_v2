import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { formatTimestamp } from '../utils/helpers';

const WillDetailsCard = ({ willData }) => {
  const [belovedDetails, setBelovedDetails] = useState({
    data: null,
    isLoading: false,
  });

  const myWill = willData?.will;
  const myProfile = willData?.will?.profiles;

  const myInfo = {
    last_updated: formatTimestamp(myWill?.last_updated),
    nric_name: myWill?.nric_name,
    nric_no: myProfile?.nric_no,
    address: `${myProfile?.address_1}, ${
      myProfile?.address_2
        ? `${myProfile.address_2}, ${myProfile?.city}`
        : myProfile?.city
    } , ${myProfile?.country}
    `,
    primary_co_sampul: belovedDetails.data?.primaryUser,
    secondary_co_sampul: belovedDetails.data?.secondaryUser,
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
          description: `${myInfo.primary_co_sampul?.nric_name}, ${myInfo.primary_co_sampul?.nric_no} is appointed to safekeep and deliver this wasiat of my digital assets to my beneficiaries.`,
        },
        {
          title: '6. Substitute Co-Sampul',
          description: `If necessary, ${myInfo.secondary_co_sampul?.nric_name}, ${myInfo.secondary_co_sampul?.nric_no} will act as Substitute Co-Sampul.`,
        },
        {
          title: '7. Digital Assets Distribution',
          description: `
          ● Specific Beneficiaries: Certain assets are designated for specific beneficiaries or based on Faraid as per [Table 1].
          ● Residual Estate: The rest of my digital assets not specifically mentioned are to be distributed accordingly either to specific beneficiaries or based on Faraid.
          ● Additional Bequests: For waqaf, sedekah, charity, [Waqaf/Charitable Body] is designated as per [Table 1]`,
          addBreak: true,
        },
        {
          title: '8. Guardianship',
          description: `If my spouse predeceases me or is unable, [Guardian Name], [IC] is appointed for my minor children, with [Guardian Name 2] [IC] as an alternate as per [Table 1]`,
        },
        {
          title: '9. Signed by',
          description: `
          ${myInfo.nric_name},
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
      title: 'Will & Testator for Digital Asset',
    },
  };

  const chekReligion = () => {
    if (willData.will?.profiles?.religion == 'islam') {
      return 'muslim';
    } else {
      return 'non_muslim';
    }
  };

  useEffect(() => {
    if (willData.beloved.length > 0) {
      checkBeloved();
    }
  }, [willData.beloved]);

  const checkBeloved = () => {
    if (willData.beloved.length !== 0) {
      var primaryUser = {};
      var secondaryUser = {};

      willData.beloved.map((item) => {
        if (item.type == 'co_sampul' && item.level == 'primary') {
          primaryUser = item;
        }
        if (item.type == 'co_sampul' && item.level == 'secondary') {
          secondaryUser = item;
        }
      });

      if (primaryUser && secondaryUser) {
        setBelovedDetails({
          ...belovedDetails,
          data: {
            primaryUser: primaryUser,
            secondaryUser: secondaryUser,
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
          <strong>{will_settings[chekReligion()].title}</strong>
        </div>
        {will_settings[chekReligion()]?.info?.map((item) => {
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
    </>
  );
};

export default WillDetailsCard;
