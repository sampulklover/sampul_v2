import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import Image from 'next/image';
import { useEffect } from 'react';

const ExecutorGetStarted = ({ onSubmitToggle = 0, onSuccess = () => {} }) => {
  const { locale, changeLocale } = useLocale();
  const t = translations[locale].executor.get_started;

  useEffect(() => {
    if (onSubmitToggle > 0) {
      onSuccess();
    }
  }, [onSubmitToggle]);

  const listItems = [
    {
      id: 1,
      icon: 'images/search-121.svg',
      title: t.professional_management,
      description: t.professional_management_desc,
    },
    {
      id: 2,
      icon: 'images/target-05.svg',
      title: t.protect_legacy,
      description: t.protect_legacy_desc,
    },
    {
      id: 3,
      icon: 'images/zap-2.svg',
      title: t.your_wishes,
      description: t.your_wishes_desc,
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

export default ExecutorGetStarted;
