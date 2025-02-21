import { paymentMethods } from '../constant/enum';
import { useApi } from '../context/api';
import { useTempData } from '../context/tempData';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const TrustReceiveInfo = () => {
  return (
    <div className="mt-3 text-center">
      <div>
        <Image
          src={'images/being-at-peace.svg'}
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: '50%',
            height: '50%',
          }}
        />
      </div>
    </div>
  );
};

export default TrustReceiveInfo;
