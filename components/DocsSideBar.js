import { docsContent } from '../constant/docs-content';
import { useRouter } from 'next/router';

const DocsSideBar = ({
  children,
  selectedMenu,
  setSelectedMenu,
  selectedSubMenu,
  setSelectedSubMenu,
  scrollToElement,
}) => {
  // const router = useRouter();

  const pageList = docsContent;

  const listItem = () => {
    return (
      <>
        <ul class="w-100 nav" id="menu">
          {pageList.map((item, index) => {
            return (
              <div key={index}>
                <li class="w-100 mb-2">
                  <div
                    class={`pointer-on-hover w-100 rounded ${
                      selectedMenu == item.key
                        ? 'nav-link-selected nav-link-custom'
                        : 'nav-link nav-link-custom'
                    }`}
                    onClick={() => {
                      setSelectedMenu(item.key);
                    }}
                  >
                    <div class="_w-navlinks">
                      <div class="c-navlink-icon">
                        <div class="html-embed w-embed">{item.icon}</div>
                      </div>
                      <div class="c-navlink-text">
                        <div>{item.mainTitle}</div>
                      </div>
                    </div>
                  </div>
                </li>
                {item.content.map((item2, index) => {
                  return (
                    <li class="w-100 mb-2" key={index}>
                      <div
                        class={`pointer-on-hover w-100 rounded ${
                          selectedSubMenu == item2.title
                            ? 'nav-link-selected nav-link-custom'
                            : 'nav-link nav-link-custom'
                        }`}
                        onClick={() => {
                          setSelectedMenu(item.key);
                          setSelectedSubMenu(item2.subKey);

                          if (document.getElementById(item2.subKey)) {
                            scrollToElement(item2.subKey);
                          } else {
                            setTimeout(() => {
                              if (document.getElementById(item2.subKey)) {
                                scrollToElement(item2.subKey);
                              }
                            }, 500);
                          }
                        }}
                      >
                        <div class="_w-navlinks" style={{ minHeight: 35 }}>
                          <div class="c-navlink-icon">
                            <div class="html-embed w-embed">{item2?.icon}</div>
                          </div>
                          <div class="c-navlink-text">
                            <div
                              class={`${
                                selectedSubMenu == item2.title
                                  ? 'font-weight-bold'
                                  : 'font-weight-normal'
                              }`}
                            >
                              {item2.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </div>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <>
      <div class="d-md-none d-block">
        <button
          class="btn btn-primary mt-3 ms-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
        >
          <i class="bi bi-list"></i> Show Menu
        </button>
        <div
          class="offcanvas offcanvas-start"
          data-bs-scroll="true"
          tabindex="-1"
          id="offcanvasWithBothOptions"
          aria-labelledby="offcanvasWithBothOptionsLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">
              Menu
            </h5>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body h-100 overflow-auto">{listItem()}</div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <div class="d-none d-md-block col-auto col-md-3 col-xl-2 px-sm-2 px-0 align-self-start align-self-stretch nav-bg-custom">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 pt-3">
              {listItem()}
            </div>
          </div>
          <div class="col">{children}</div>
        </div>
      </div>
    </>
  );
};

export default DocsSideBar;

// The summary of this page includes:
// This page is designed to display a dynamic sidebar menu for navigating documentation content.
// It utilizes Next.js's useRouter for routing and imports content from a constant named docsContent.
// The sidebar includes a list of items with main titles and associated submenus.
// Each item and submenu can be selected, triggering actions such as scrolling to specific elements on the page.
// The sidebar adjusts its layout responsively, showing a compact menu toggle button on smaller screens and expanding into a full sidebar on larger screens.
