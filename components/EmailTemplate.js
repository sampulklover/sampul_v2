import * as React from 'react';

export const inviteBelove = ({
  to_email,
  to_nric_name,
  to_type,
  to_level,
  from_name,
  invite_uuid,
}) => {
  const contentStyle = {
    titleText: {
      width: '100%',
      color: '#101828',
      fontSize: '36px',
      fontWeight: '600',
      lineHeight: '44px',
      wordWrap: 'break-word',
      marginTop: '25px',
      marginBottom: '25px',
    },
    bodyContainer: {
      paddingTop: '32px',
      paddingBottom: '32px',
      paddingLeft: '24px',
      paddingRight: '24px',
      backgroundColor: '#FFFFF',
    },
    bodyText: {
      color: '#475467',
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '28px',
      wordWrap: 'break-word',
      marginBottom: '35px',
    },
    footerText: {
      color: '#475467',
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: '28px',
      wordWrap: 'break-word',
      marginBottom: '35px',
    },
    primaryText: {
      color: '#2F1DA9',
      textDecoration: 'none',
    },
    primaryButton: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: 1.5,
      textAlign: 'center',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      cursor: 'pointer',
      border: '1px solid transparent',
      borderRadius: '0.5rem',
      color: '#fff',
      backgroundColor: '#3c22e2',
    },
    lightButton: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: 1.5,
      textAlign: 'center',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      cursor: 'pointer',
      border: '1px solid #dee2e6', // Adjusted border color
      borderRadius: '0.5rem',
      color: '#333',
      backgroundColor: '#ffff',
      marginLeft: '10px',
    },
    footerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '50px',
    },
    socialMediaContainer: {
      display: 'flex',
    },
  };

  const langguage = {
    english: {
      body: (
        <>
          <p>
            We are delighted to inform you that you had been selected as a{' '}
            {to_level} {to_type} for{' '}
            <span style={contentStyle.primaryText}>{from_name}.</span> We hope
            that you have been briefed by {from_name} on the appointment and are
            ready to take on the responsibilities.
          </p>
          <p>
            Briefly, your responsibilities as a Co-Sampul is to be given the
            information of{' '}
            <span style={contentStyle.primaryText}>{from_name}’s</span>{' '}
            wasiat/will which contain all assets’ information and wishes at the
            point of death and assist the loved ones in managing the estate in
            the event of death.
          </p>
        </>
      ),
      thanksMessage: (
        <p>
          Thanks for signing up. We hope you're excited to join the mission of
          safekeeping asset for the loved ones. If you have any questions, send
          us a message at{' '}
          <span style={contentStyle.primaryText}>hi@sampul.com</span> or on{' '}
          <a
            style={contentStyle.primaryText}
            href={process.env.NEXT_PUBLIC_TWITTER_URL}
          >
            Twitter
          </a>
          . We’d love to hear from you.
          <br />
          <br />— The Sampul team
        </p>
      ),
      unsubscribeMessage: (
        <p>
          This email was sent to{' '}
          <span style={contentStyle.primaryText}>{to_email}</span>.
          <br />
          <br />© 2024 sampul.co
        </p>
      ),
    },
    malay: {
      body: (
        <div style={{ 'font-style': 'italic' }}>
          <p>
            Kami berbesar hati ingin memaklumkan kepada anda yang anda telah
            dilantik oleh{' '}
            <span style={contentStyle.primaryText}>{from_name}</span> sebagai{' '}
            {to_level} {to_type}. Kami percaya anda telah dimaklumkan akan
            pelantikan ini dan bersedia memikul tanggungjawab murni ini.
          </p>
          <p>
            Secara ringkas, peranan Co-Sampul adalah anda akan diberikan akses
            wasiat milik{' '}
            <span style={contentStyle.primaryText}>{from_name}</span> yang
            mengandungi senarai aset dan hasrat apabila berlakunya kematian dan
            kongsikan kepada waris untuk urusan pusaka.
          </p>
        </div>
      ),
    },
  };

  const accessableLink = [
    {
      title: 'Sampul process flow',
      description: 'Weekly new updates and improvements to Sampul.',
      link: process.env.NEXT_PUBLIC_HOST,
    },
    {
      title: 'Sampul’s FAQ',
      description: 'Stay up-to-date with the latest announcements and jobs.',
      link: process.env.NEXT_PUBLIC_HOST,
    },
    {
      title: 'Why we’re building Sampul',
      description:
        'There are currently RM 100 billion worth of frozen asset and unclaimed monies in our country. Our mission is to ensure no one and no asset is left behind in the estate planning process.',
      link: process.env.NEXT_PUBLIC_HOST,
    },
  ];

  const divider = () => {
    return (
      <div
        style={{
          width: '150px',
          height: '2px',
          background: '#EAECF0',
          marginTop: '35px',
          marginBottom: '35px',
        }}
      ></div>
    );
  };

  return (
    <div style={contentStyle.bodyContainer}>
      <img
        src="https://sampul.co/images/Email_sampul_background.png"
        alt="Sampul"
        height="100%"
        width="100%"
      />
      <div style={contentStyle.titleText}>
        Salam and Greetings {to_nric_name},
      </div>
      <div style={{ width: '100%' }}>
        <div style={contentStyle.bodyText}>
          {langguage.english.body}
          {divider()}
          {langguage.malay.body}
        </div>
        <div>
          <a
            style={contentStyle.primaryButton}
            href={`${process.env.NEXT_PUBLIC_HOST}/beloved-invites?status=accepted&id=${invite_uuid}`}
          >
            Accept
          </a>
          <a
            style={contentStyle.lightButton}
            href={`${process.env.NEXT_PUBLIC_HOST}/beloved-invites?status=rejected&id=${invite_uuid}`}
          >
            Reject
          </a>
        </div>
        {divider()}
        {accessableLink.map((item, index) => {
          return (
            <span style={contentStyle.bodyText} key={index}>
              <a href={item.link} style={contentStyle.primaryText}>
                <b>{item.title}</b>
              </a>{' '}
              <span style={contentStyle.primaryText}>→</span>
              <br />
              <span>{item.description}</span>
              <br />
              <br />
            </span>
          );
        })}
        <span style={contentStyle.bodyText}>
          {langguage.english.thanksMessage}
          <br />
        </span>
        <span style={contentStyle.footerText}>
          {langguage.english.unsubscribeMessage}
        </span>
        <div style={contentStyle.footerContainer}>
          <a
            href={process.env.NEXT_PUBLIC_HOST}
            style={{ marginRight: 'auto' }}
          >
            <img
              src="https://sampul.co/images/Logo.png"
              alt="Sampul"
              height="30"
              width="100%"
            />
          </a>
          <div style={contentStyle.socialMediaContainer}>
            <a
              href={process.env.NEXT_PUBLIC_TWITTER_URL}
              style={{ marginRight: '10px' }}
            >
              <img
                src="https://sampul.co/images/Social_icon_x.png"
                alt="X"
                height="30"
                width="100%"
              />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
              style={{ marginRight: '10px' }}
            >
              <img
                src="https://sampul.co/images/Social_icon_facebook.png"
                alt="Facebook"
                height="30"
                width="100%"
              />
            </a>
            <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}>
              <img
                src="https://sampul.co/images/Social_icon_instagram.png"
                alt="Instagram"
                height="30"
                width="100%"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
