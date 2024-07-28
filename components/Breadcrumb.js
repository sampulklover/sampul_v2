import Link from 'next/link';

const Breadcrumb = ({ pageName, rightSection = null }) => {
  return (
    <div class="breadcrumbs-2">
      <div class="d-flex col">
        {/* {pageName == 'Dashboard' ? (
          <></>
        ) : (
          <>
            <div class="breadcrumb-button-base-4">
              <Link href="/dashboard">
                <img
                  src="images/Vectors-Wrapper_23.svg"
                  loading="lazy"
                  alt=""
                  class="vectors-wrapper-24"
                />
              </Link>
            </div>
            <img
              src="images/Vectors-Wrapper.svg"
              loading="lazy"
              alt=""
              class="vectors-wrapper-31"
            />
          </>
        )} */}
        {/* <div class="breadcrumb-button-base-5"> */}
        <div class="breadcrumb-title-01">{pageName}</div>
        {/* </div> */}
      </div>
      {rightSection ? <div class="d-flex col-auto">{rightSection}</div> : ''}
    </div>
  );
};

export default Breadcrumb;

// The summary of this page includes:
// This page generates a breadcrumb navigation element based on the current page name provided as a prop.
// If the page name is 'Dashboard', it only displays the current page name without any navigation links.
// For other pages, it renders a navigation trail with a home link represented by an image and an additional separator image.
