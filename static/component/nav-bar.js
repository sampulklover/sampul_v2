function navBar() {
  return ` <nav
  class="navbar sticky-top navbar-expand-sm border-bottom bg-white navbar-padding"
>
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
      <img
        src="../../static/images/Logo.svg"
        alt="image"
        sizes="100vw"
        style="width: 150; height: 'auto'"
        class="d-inline-block align-text-top"
      />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mynavbar"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mynavbar">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item pe-2">
          <a
            href="signin"
            class="btn btn-light btn-text btn-lg"
            type="button"
          >
            Sign in
          </a>
        </li>
        <li class="nav-item">
          <a
            href="signup"
            class="btn btn-primary btn-lg btn-text"
            type="button"
          >
            Sign up
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
<div
  data-collapse="none"
  data-animation="default"
  data-duration="400"
  data-easing="ease"
  data-easing2="ease"
  role="banner"
  class="navbar w-nav"
>
  <div class="wrapper navbar-wrapper">
    <div class="left-navbar">
      <a href="/" aria-current="page" class="brand w-nav-brand w--current"
        ><img src="../../static/images/Logo.svg" loading="lazy" alt=""
      /></a>
    </div>
    <div class="menu-wrapper bg-white">
      <nav role="navigation" class="nav-menu w-nav-menu">
        <div class="navigation-links">
          <a href="signin" class="nav-link w-inline-block">
            <div class="button-text">Sign In</div>
            <div class="nav-link-hover-button"></div>
          </a>
          <div
            id="w-node-f6efcca6-98f9-7a0c-f13f-b114532e0d43-56a0d8b3"
            class="uui-navbar02_menu-right"
          >
            <div class="uui-navbar02_button-wrapper">
              <a href="signup" class="uui-button-2 w-inline-block">
                <div>Sign up</div>
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div class="w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>
      <div class="navigation-cover"></div>
    </div>
    <div class="mega-menu">
      <div class="large-menu-wrapper">
        <div
          id="w-node-_17c43587-c790-b4d8-1466-5f40336b9d5b-336b9d43"
          class="projects-search-wrapper"
        >
          <div
            id="w-node-_17c43587-c790-b4d8-1466-5f40336b9d5d-336b9d43"
            class="search-wrapper"
          >
            <form action="/search" class="search w-form">
              <input
                class="search-input w-input"
                maxlength="256"
                name="query"
                placeholder="Search projects…"
                type="search"
                id="search"
                required
              /><input
                type="submit"
                class="search-button w-button"
                value="Search"
              />
            </form>
          </div>
          <div
            id="w-node-_6fe66bf6-22c6-7c4b-e980-c09ffd4740ae-336b9d43"
            class="mega-social-wrapper"
          >
            <div class="team-social-wrapper">
              <a
                href="https://www.instagram.com/tycreated/"
                target="_blank"
                class="team-social-icon outline w-inline-block"
                ><img
                  src="../../static/images/IG.svg"
                  loading="lazy"
                  alt=""
              /></a>
              <a
                href="https://twitter.com/Tycreated"
                target="_blank"
                class="team-social-icon outline w-inline-block"
                ><img
                  src="../../static/images/facebook-f.svg"
                  loading="lazy"
                  alt=""
              /></a>
              <a
                href="https://twitter.com/Tycreated"
                target="_blank"
                class="team-social-icon outline w-inline-block"
                ><img
                  src="../../static/images/linkedin.svg"
                  loading="lazy"
                  alt=""
              /></a>
              <a
                href="https://twitter.com/Tycreated"
                target="_blank"
                class="team-social-icon outline w-inline-block"
                ><img
                  src="../../static/images/YT.svg"
                  loading="lazy"
                  alt=""
              /></a>
            </div>
          </div>
        </div>
        <div
          id="w-node-_16738520-6de8-1fcc-6cbc-d48e45d42b91-336b9d43"
          class="mega-category-list"
        >
          <div class="stacked-description horizontal">
            <div
              id="w-node-_16738520-6de8-1fcc-6cbc-d48e45d42b93-336b9d43"
              class="subtitle"
            >
              Our team
            </div>
            <a
              id="w-node-f4f0ce64-1f82-9e16-20fb-882e6946b843-336b9d43"
              href="company"
              class="button grey-outline small w-inline-block"
            >
              <div class="button-text">About us</div>
            </a>
          </div>
          <div>
            <div class="w-dyn-list">
              <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                <div
                  role="listitem"
                  class="menu-collection-list-item w-dyn-item"
                >
                  <a
                    href="#"
                    class="post-list-item category-list-item w-inline-block"
                  >
                    <div class="stacked-description horizontal">
                      <div class="list-item-text"></div>
                      <div
                        id="w-node-_7a338548-6995-26a0-d4df-2c2b4c59a395-4c59a38f"
                        class="subtitle"
                      ></div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="w-node-_17c43587-c790-b4d8-1466-5f40336b9d61-336b9d43"
          class="mega-category-list middle"
        >
          <div class="stacked-description horizontal">
            <div
              id="w-node-_17c43587-c790-b4d8-1466-5f40336b9d63-336b9d43"
              class="subtitle"
            >
              Project Categories
            </div>
            <a
              id="w-node-aea9f59c-b439-2797-db5e-6ba2ebbcded2-336b9d43"
              href="projects"
              class="button grey-outline small w-inline-block"
            >
              <div class="button-text">View all</div>
            </a>
          </div>
          <div>
            <div class="w-dyn-list">
              <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                <div
                  role="listitem"
                  class="menu-collection-list-item w-dyn-item"
                >
                  <a
                    href="#"
                    class="post-list-item category-list-item w-inline-block"
                  >
                    <div class="stacked-description">
                      <div
                        id="w-node-e8411f27-0bc9-1e9f-ead1-b785bda240e5-bda240e0"
                        class="list-item-text"
                      ></div>
                    </div>
                    <img
                      src="../../static/images/arrow-right48x482x.svg"
                      loading="lazy"
                      id="w-node-e8411f27-0bc9-1e9f-ead1-b785bda240e6-bda240e0"
                      alt=""
                      class="list-item-arrow"
                    />
                  </a>
                </div>
              </div>
              <div class="w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="w-node-e16c4357-004d-8209-e100-36bb04545bd4-336b9d43"
          class="mega-category-list"
        >
          <div class="stacked-description horizontal">
            <div
              id="w-node-e16c4357-004d-8209-e100-36bb04545bd6-336b9d43"
              class="subtitle"
            >
              News Categories
            </div>
            <a
              id="w-node-_1e0f0e3b-c735-de45-d3e2-0c9fcf80a649-336b9d43"
              href="resources"
              class="button grey-outline small w-inline-block"
            >
              <div class="button-text">View all</div>
            </a>
          </div>
          <div>
            <div class="w-dyn-list">
              <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                <div
                  role="listitem"
                  class="menu-collection-list-item w-dyn-item"
                >
                  <a
                    href="#"
                    class="post-list-item category-list-item w-inline-block"
                  >
                    <div class="stacked-description">
                      <div class="list-item-text"></div>
                    </div>
                    <img
                      src="../../static/images/arrow-right48x482x.svg"
                      loading="lazy"
                      id="w-node-_4541705a-de97-7f82-8818-9c9145464680-4546467a"
                      alt=""
                      class="list-item-arrow"
                    />
                  </a>
                </div>
              </div>
              <div class="w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="w-node-d364a0a1-eed2-cc02-8c38-c72be241387a-336b9d43"
          class="tablet-mobile-menu"
        >
          <div
            data-hover="false"
            data-delay="1300"
            id="w-node-_742bc615-eb92-0d24-5678-32641c325156-336b9d43"
            class="dropdown top w-dropdown"
          >
            <div class="dropdown-toggle w-dropdown-toggle">
              <div class="body-display dark">Our team</div>
              <div
                data-is-ix2-target="1"
                class="dropdown-lottie"
                data-w-id="310e10b1-84f0-48f0-3347-482d442c2ed8"
                data-animation-type="lottie"
                data-src="../../static/documents/dropdown-easey.json"
                data-loop="0"
                data-direction="1"
                data-autoplay="0"
                data-renderer="svg"
                data-default-duration="2"
                data-duration="0"
                data-ix2-initial-state="50"
              ></div>
            </div>
            <nav class="dropdown-list w-dropdown-list">
              <div class="w-dyn-list">
                <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                  <div
                    role="listitem"
                    class="menu-collection-list-item w-dyn-item"
                  >
                    <a
                      href="#"
                      class="post-list-item category-list-item w-inline-block"
                    >
                      <div class="stacked-description horizontal">
                        <div class="list-item-text"></div>
                        <div
                          id="w-node-_7a338548-6995-26a0-d4df-2c2b4c59a395-4c59a38f"
                          class="subtitle"
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <a
                href="company"
                class="post-list-item category-list-item w-inline-block"
              >
                <div>About us</div>
                <img
                  src="../../static/images/arrow-right48x482x.svg"
                  loading="lazy"
                  id="w-node-f6a0a796-4f1d-5758-490b-395b2a23adce-336b9d43"
                  alt=""
                  class="list-item-arrow"
                />
              </a>
            </nav>
          </div>
          <div
            data-hover="false"
            data-delay="1300"
            id="w-node-e7216152-f701-971a-aa13-8b0d399ea0a2-336b9d43"
            class="dropdown w-dropdown"
          >
            <div class="dropdown-toggle w-dropdown-toggle">
              <div class="body-display dark">Project categories</div>
              <div
                data-is-ix2-target="1"
                class="dropdown-lottie"
                data-w-id="26ed9205-d756-8b1d-71b5-e2d2bc505b69"
                data-animation-type="lottie"
                data-src="../../static/documents/dropdown-easey.json"
                data-loop="0"
                data-direction="1"
                data-autoplay="0"
                data-renderer="svg"
                data-default-duration="2"
                data-duration="0"
                data-ix2-initial-state="50"
              ></div>
            </div>
            <nav class="dropdown-list w-dropdown-list">
              <div class="w-dyn-list">
                <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                  <div
                    role="listitem"
                    class="menu-collection-list-item w-dyn-item"
                  >
                    <a
                      href="#"
                      class="post-list-item category-list-item w-inline-block"
                    >
                      <div class="stacked-description">
                        <div
                          id="w-node-e8411f27-0bc9-1e9f-ead1-b785bda240e5-bda240e0"
                          class="list-item-text"
                        ></div>
                      </div>
                      <img
                        src="../../static/images/arrow-right48x482x.svg"
                        loading="lazy"
                        id="w-node-e8411f27-0bc9-1e9f-ead1-b785bda240e6-bda240e0"
                        alt=""
                        class="list-item-arrow"
                      />
                    </a>
                  </div>
                </div>
                <div class="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <a
                href="projects"
                class="post-list-item category-list-item w-inline-block"
              >
                <div>View all</div>
                <img
                  src="../../static/images/arrow-right48x482x.svg"
                  loading="lazy"
                  id="w-node-_169c8dac-dcf9-9d77-b5a0-6fe2bb220d51-336b9d43"
                  alt=""
                  class="list-item-arrow"
                />
              </a>
            </nav>
          </div>
          <div
            data-hover="false"
            data-delay="1300"
            id="w-node-fdd5de7a-6baa-18bc-4fc4-17f9de14bff9-336b9d43"
            class="dropdown w-dropdown"
          >
            <div class="dropdown-toggle w-dropdown-toggle">
              <div class="body-display dark">News categories</div>
              <div
                data-is-ix2-target="1"
                class="dropdown-lottie"
                data-w-id="7c88412b-5653-be4c-c04b-15b269f63e7d"
                data-animation-type="lottie"
                data-src="../../static/documents/dropdown-easey.json"
                data-loop="0"
                data-direction="1"
                data-autoplay="0"
                data-renderer="svg"
                data-default-duration="2"
                data-duration="0"
                data-ix2-initial-state="50"
              ></div>
            </div>
            <nav class="dropdown-list w-dropdown-list">
              <div class="w-dyn-list">
                <div role="list" class="mega-menu-list-wrapper w-dyn-items">
                  <div
                    role="listitem"
                    class="menu-collection-list-item w-dyn-item"
                  >
                    <a
                      href="#"
                      class="post-list-item category-list-item w-inline-block"
                    >
                      <div class="stacked-description">
                        <div class="list-item-text"></div>
                      </div>
                      <img
                        src="../../static/images/arrow-right48x482x.svg"
                        loading="lazy"
                        id="w-node-_4541705a-de97-7f82-8818-9c9145464680-4546467a"
                        alt=""
                        class="list-item-arrow"
                      />
                    </a>
                  </div>
                </div>
                <div class="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <a
                href="resources"
                class="post-list-item category-list-item w-inline-block"
              >
                <div>View all</div>
                <img
                  src="../../static/images/arrow-right48x482x.svg"
                  loading="lazy"
                  id="w-node-fbb98bb2-0970-908c-f9a3-aa45d34eaea4-336b9d43"
                  alt=""
                  class="list-item-arrow"
                />
              </a>
            </nav>
          </div>
        </div>
        <div
          id="w-node-be6e1212-c8c8-b564-9d2f-b92422ca9045-336b9d43"
          class="tablet-mobile-nav-links"
        >
          <div class="navigation-links">
            <a href="signin" class="nav-link w-inline-block">
              <div class="button-text">Sign In</div>
              <div class="nav-link-hover-button"></div>
            </a>
            <div
              id="w-node-f6efcca6-98f9-7a0c-f13f-b114532e0d43-56a0d8b3"
              class="uui-navbar02_menu-right"
            >
              <div class="uui-navbar02_button-wrapper">
                <a href="signup" class="uui-button-2 w-inline-block">
                  <div>Sign up</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mega-menu-overlay"></div>
  </div>
</div>           
  `;
}
