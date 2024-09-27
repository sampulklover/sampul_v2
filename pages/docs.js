import DocsSideBar from '../components/DocsSideBar';
import { docsContent } from '../constant/docs-content';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Docs = () => {
  const router = useRouter();

  const [selectedMenu, setSelectedMenu] = useState('about-us');
  const [selectedSubMenu, setSelectedSubMenu] = useState('about-us');

  const selectedSection = docsContent.find(
    (section) => section.key === selectedMenu
  );

  const scrollToElement = (subKey) => {
    if (subKey) {
      const targetElement = document.getElementById(subKey);

      if (targetElement) {
        const navHeight = 150;
        const offsetTop = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const key = router.query.key;
      const subKey = router.query.subKey;
      if (key) {
        setSelectedMenu(key);
      }
      if (subKey) {
        setTimeout(() => {
          scrollToElement(subKey);
        }, 1000);
      }
    }
  }, [router.isReady]);

  return (
    <>
      <DocsSideBar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        selectedSubMenu={selectedSubMenu}
        setSelectedSubMenu={setSelectedSubMenu}
        scrollToElement={scrollToElement}
      >
        <div class="row mt-3">
          <div class="col-lg">
            <div class="breadcrumbs-2 mb-3">
              <div class="breadcrumb-button-base-4">
                {selectedSection?.icon}
              </div>
              <img
                src="images/Vectors-Wrapper.svg"
                loading="lazy"
                alt=""
                class="vectors-wrapper-31"
              />
              <div class="breadcrumb-button-base-5">
                <div class="smpl_text-sm-medium text-color-primary700">
                  {selectedSection?.mainTitle}
                </div>
              </div>
            </div>
            <h2 class="mb-3 uui-heading-medium">
              {selectedSection?.mainTitle}
            </h2>
            {selectedSection &&
              selectedSection.content.map((item, index) => (
                <div key={index}>
                  <h3 id={item.subKey}>{item.title}</h3>
                  <div class="uui-text-size-large" style={{ borderWidth: 0 }}>
                    {item.content}
                  </div>
                </div>
              ))}
          </div>
          <div class="col-auto text-muted sticky-item pe-5 stick-to-top">
            <strong class="d-block h6 my-2 pb-2 border-bottom text-primary">
            Kandungan
            </strong>
            <nav class="table-content-text">
              <ul>
                {selectedSection &&
                  selectedSection.content.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        if (document.getElementById(item.subKey)) {
                          scrollToElement(item.subKey);
                        } else {
                          setTimeout(() => {
                            if (document.getElementById(item.subKey)) {
                              scrollToElement(item.subKey);
                            }
                          }, 500);
                        }
                      }}
                    >
                      <span class="pointer-on-hover">{item.title}</span>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>
      </DocsSideBar>
    </>
  );
};

export default Docs;

// The summary of this page includes:
// This page serves as a documentation viewer.
// It integrates with Next.js router to dynamically load content based on URL queries.
// The main functionality includes selecting and displaying documentation sections and subsections.
// When a user navigates to a specific section (defined by 'key' and optionally 'subKey' in the URL),
// the component updates to highlight the selected menu and scroll to the relevant subsection within that section.
