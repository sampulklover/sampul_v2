import { useEffect, useState } from 'react';
import DocsSideBar from '../components/DocsSideBar';
import { docsContent } from '../constant/docs-content';

const Docs = () => {
  const [selectedMenu, setSelectedMenu] = useState('About Us');
  const [selectedSubMenu, setSelectedSubMenu] = useState('About Us');

  const selectedSection = docsContent.find(
    (section) => section.mainTitle === selectedMenu
  );

  return (
    <>
      <DocsSideBar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        selectedSubMenu={selectedSubMenu}
        setSelectedSubMenu={setSelectedSubMenu}
      >
        <div class="row mt-3">
          <div class="col-lg">
            <h2 class="mb-2 uui-heading-medium">
              {selectedSection?.mainTitle}
            </h2>
            {selectedSection &&
              selectedSection.content.map((item, index) => (
                <div key={index}>
                  <h3 id={item.id}>{item.title}</h3>
                  <div class="uui-text-size-large">{item.content}</div>
                </div>
              ))}
          </div>
          <div class="col-auto text-muted sticky-item pe-5">
            <strong class="d-block h6 my-2 pb-2 border-bottom text-primary">
              Table of contents
            </strong>
            <nav class="table-content-text">
              <ul>
                {selectedSection &&
                  selectedSection.content.map((item, index) => (
                    <li key={index}>
                      <a href={`#${item.id}`} class="no-line">
                        {item.title}
                      </a>
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
