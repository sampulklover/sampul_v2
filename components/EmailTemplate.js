import * as React from 'react';

export const inviteBelove = ({
  to_email,
  to_nric_name,
  to_type,
  to_level,
  from_name,
  invite_uuid,
}) => {
  return (
    <div>
      <h1>Salam and Greetings {to_nric_name},</h1>
      <p>
        We are delighted to inform you that you had been selected as a{' '}
        {to_level} {to_type} for {from_name}. We hope that you have been briefed
        by {from_name} on the appointment and are ready to take on the
        responsibilities.
      </p>
      <p>
        Briefly, your responsibilities as a Co-Sampul is to be given the
        information of {from_name}’s wasiat/will which contain all assets’
        information and wishes at the point of death and assist the loved ones
        in managing the estate in the event of death. Click{' '}
        <a href={`${process.env.NEXT_PUBLIC_HOST}`}>HERE</a> for the process
        flow.
      </p>
      <p>
        <a
          href={`${process.env.NEXT_PUBLIC_HOST}/beloved-invites?status=accepted&id=${invite_uuid}`}
        >
          <b>ACCEPT</b>
        </a>
      </p>
      <p>
        <a
          href={`${process.env.NEXT_PUBLIC_HOST}/beloved-invites?status=rejected&id=${invite_uuid}`}
        >
          <b>REJECT</b>
        </a>
      </p>
      <p>
        We hope you're excited to join the mission of safekeeping asset for the
        loved ones.
      </p>
      <p>
        There are currently RM 100 billion worth of frozen asset and unclaimed
        monies in our country. Our mission is to ensure no one and no asset is
        left behind in the estate planning process.
      </p>
      <p>The Sampul team</p>
    </div>
  );
};
