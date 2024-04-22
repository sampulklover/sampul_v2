import { useRouter } from 'next/router';

const DocsSideBar = ({ children, selectedMenu, setSelectedMenu }) => {
  const router = useRouter();

  const pageList = [
    {
      title: 'Home',
      key: 'home',
      display: true,
      action: () => {
        setSelectedMenu('home');
      },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="home-01">
              <path
                id="Icon"
                d="M3 10.5658C3 9.99143 3 9.70425 3.07403 9.43978C3.1396 9.20552 3.24737 8.98518 3.39203 8.78959C3.55534 8.56879 3.78202 8.39248 4.23539 8.03986L11.0177 2.76473C11.369 2.49148 11.5447 2.35485 11.7387 2.30233C11.9098 2.25599 12.0902 2.25599 12.2613 2.30233C12.4553 2.35485 12.631 2.49148 12.9823 2.76473L19.7646 8.03986C20.218 8.39248 20.4447 8.56879 20.608 8.78959C20.7526 8.98518 20.8604 9.20552 20.926 9.43978C21 9.70425 21 9.99143 21 10.5658V17.8007C21 18.9208 21 19.4809 20.782 19.9087C20.5903 20.285 20.2843 20.591 19.908 20.7827C19.4802 21.0007 18.9201 21.0007 17.8 21.0007H6.2C5.07989 21.0007 4.51984 21.0007 4.09202 20.7827C3.71569 20.591 3.40973 20.285 3.21799 19.9087C3 19.4809 3 18.9208 3 17.8007V10.5658Z"
                stroke={selectedMenu == 'home' ? '#533de9' : '#667085'}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </svg>
      ),
    },
    {
      title: 'Getting Started',
      key: 'getting-started',
      display: true,
      action: () => {
        setSelectedMenu('getting-started');
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="play-circle">
            <g id="Icon">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke={
                  selectedMenu == 'getting-started' ? '#533de9' : '#667085'
                }
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.5 8.96533C9.5 8.48805 9.5 8.24941 9.59974 8.11618C9.68666 8.00007 9.81971 7.92744 9.96438 7.9171C10.1304 7.90525 10.3311 8.03429 10.7326 8.29239L15.4532 11.3271C15.8016 11.551 15.9758 11.663 16.0359 11.8054C16.0885 11.9298 16.0885 12.0702 16.0359 12.1946C15.9758 12.337 15.8016 12.449 15.4532 12.6729L10.7326 15.7076C10.3311 15.9657 10.1304 16.0948 9.96438 16.0829C9.81971 16.0726 9.68666 15.9999 9.59974 15.8838C9.5 15.7506 9.5 15.512 9.5 15.0347V8.96533Z"
                stroke="#667085"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </svg>
      ),
    },
  ];

  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 align-self-start align-self-stretch nav-bg-custom">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 pt-3">
              <ul
                class="w-100 nav nav-pills flex-column  mb-sm-auto mb-0 align-items-center align-items-sm-start me-auto"
                id="menu"
              >
                {pageList.map((item, index) => {
                  if (item.display)
                    return (
                      <li class="w-100 mb-2" key={index}>
                        <div
                          class={`pointer-on-hover w-100 rounded ${
                            selectedMenu == item.key
                              ? 'nav-link-selected nav-link-custom'
                              : 'nav-link nav-link-custom'
                          }`}
                          onClick={item.action}
                        >
                          <div class="_w-navlinks">
                            <div class="c-navlink-icon">
                              <div class="html-embed w-embed">{item.icon}</div>
                            </div>
                            <div class="c-navlink-text">
                              <div class=" d-none d-sm-inline">
                                <div>{item.title}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                })}
              </ul>
            </div>
          </div>
          <div class="col">{children}</div>
        </div>
      </div>
    </>
  );
};

export default DocsSideBar;
