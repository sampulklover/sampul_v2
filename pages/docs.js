import { useEffect, useState } from 'react';
import DocsSideBar from '../components/DocsSideBar';

const Docs = () => {
  const [selectedMenu, setSelectedMenu] = useState('home');

  const docConfig = [
    {
      menu: 'home',
      title: 'What is Sampul',
      links: [
        {
          title: 'What is Sampul',
          href: '#what-is-Sampul',
        },
        {
          title: 'Why use Sampul',
          href: '#why-use-Sampul',
        },
      ],
      content: [
        {
          title: 'Introduction',
          content: (
            <>
              <p>
                Sampul is Malaysia's first digital wasiat for digital asset app,
                designed to protect and manage your digital assets, like online
                accounts and cryptocurrencies, with ease. By creating a digital
                wasiat or will, Sampul ensures your digital legacy is passed on
                according to your wishes, safeguarding your digital treasures
                for future generations. It's a smart choice for Malaysians
                looking to secure their digital footprint and preserve their
                online presence, ensuring no asset is left behind
              </p>
            </>
          ),
        },
        {
          title: 'Why use Sampul',
          content: (
            <>
              <p>
                Sampul is key for Malaysians to safeguard digital wealth, aiming
                to secure digital assets like cryptocurrencies and e-wallets for
                future generations. It addresses the challenge of RM 100 billion
                in unclaimed assets and frozen monies, extending concern into
                the digital realm. Sampul's digital wasiat/will creation ensures
                your digital assets are managed as you desire, brings clarity to
                your beneficiarys, simplifies digital asset transfer, and
                preserves your online legacy, offering peace of mind in the
                digital age.
              </p>
              <ul>
                <li>Ensuring your digital assets are managed as you wish.</li>
                <li>
                  Providing clarity to your loved ones about your online
                  accounts.
                </li>
                <li>
                  Simplifying the process of accessing and transferring digital
                  assets.
                </li>
                <li>
                  Preserving your online presence and memories for future
                  generations.
                </li>
              </ul>
            </>
          ),
        },
      ],
    },
  ];

  const selectedSection = docConfig.find(
    (section) => section.menu === selectedMenu
  );

  return (
    <>
      <DocsSideBar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      >
        <div class="row mt-3">
          <div class="col-lg">
            {selectedSection &&
              selectedSection.content.map((item, index) => (
                <div key={index}>
                  <h1 id={item.title.toLowerCase()}>{item.title}</h1>
                  <div>{item.content}</div>
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
                  selectedSection.links.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} class="no-line">
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
