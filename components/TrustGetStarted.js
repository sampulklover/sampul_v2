import { useLocale } from '../context/locale';
import Image from 'next/image';
import { useEffect } from 'react';

const TrustGetStarted = ({ onSubmitToggle = 0, onSuccess = () => {} }) => {
  const { locale, changeLocale } = useLocale();

  useEffect(() => {
    if (onSubmitToggle > 0) {
      onSuccess();
    }
  }, [onSubmitToggle]);

  const listItems = [
    {
      id: 1,
      icon: 'images/search-121.svg',
      title: 'Professional Management',
      description: 'We make sure your assets are handled carefully',
    },
    {
      id: 2,
      icon: 'images/target-05.svg',
      title: 'Protect your legacy',
      description:
        'Assets placed under a trust are safe from creditors and external claims',
    },
    {
      id: 3,
      icon: 'images/zap-2.svg',
      title: 'Your wishes, our priority',
      description:
        'Set specific instructions to ensure your plans are carried out exactly as you intended.',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="text-center">
        <Image
          src="images/being-at-peace.svg"
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '40%', height: '40%' }}
        />
      </div>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%', // Ensure the list container takes the full width
        }}
      >
        {listItems.map((item) => (
          <div
            className="list-item"
            key={item.id}
            style={{
              display: 'flex',
              marginBottom: '1rem',
              width: '100%', // Default width for mobile
              maxWidth: '500px', // Maximum width for desktop
            }}
          >
            <Image
              src={item.icon}
              alt={item.title}
              width={40}
              height={40}
              style={{ marginRight: '1rem' }}
            />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <span className="heading-04">{item.title}</span>
              <p className="paragraph-01">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustGetStarted;
