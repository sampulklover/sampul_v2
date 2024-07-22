import Image from 'next/image';
import Link from 'next/link';

const InnerHeader = ({ title = '', subtitle = '', imageSrc = '' }) => {
  return (
    <div class="mt-4">
      <div class="row text-md-start text-center">
        <div class="col-lg">
          <div class="smpl_display-sm-semibold">{title}</div>
          <div class="smpl_text-md-regular mt-4">{subtitle}</div>
        </div>
        <div class="col mt-md-0 mt-4 text-center">
          {imageSrc ? (
            <Image
              src="images/investing.svg"
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: 'auto' }}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default InnerHeader;
