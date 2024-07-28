import Image from 'next/image';
import Link from 'next/link';

const InnerHeader = ({ title = '', subtitle = '', imageSrc = '' }) => {
  return (
    <div class="row text-md-start text-center">
      <div class="col-lg">
        <div class="heading-01">{title}</div>
        <div class="paragraph-01 mt-4">{subtitle}</div>
      </div>
      <div class="col mt-md-0 mt-4 text-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '80%', height: '80%' }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default InnerHeader;
