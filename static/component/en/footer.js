function newsletterForm() {
    return `
  <form id="add-newsletter-form" class="uui-footer02_form">
  <input
    type="email"
    id="input-newsletter-email"
    class="uui-form_input w-input"
    maxlength="256"
    placeholder="Enter your email"
    required
  />
  <button
    type="submit"
    id="btn-newsletter-add-form"
    class="uui-button is-button-small w-button"
  >
    Subscribe
  </button>
</form>
  `;
}

function footer() {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 450px) {
      .responsive-collapse {
        padding: 0;
        height: auto;
        display: flex;
        flex-direction: column;
      }
      .right-col {
        width: 100%;
      }
      .uui-footer02_top-wrapper {
        flex-direction: column;
      }
      .uui-footer02_left-wrapper-new {
        width: 100%;
      }
      .footer-text {
        max-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
    return `
  <div class="full-height d-flex justify-content-center align-items-center w-100" style="padding: 48px 0; gap: 64px; height: auto; background-color: #FAFAFA;">
  <div class="responsive-collapse d-flex justify-content-between align-items-center w-100" style="height: auto; max-width: 1280px; padding: 0 32px; gap: 0px;">
    <!-- Left Column -->
    <div class="left-col d-flex flex-column">
      <p class="fs-20 fw-bold">Join sampul.co newsletter</p>
      <p class="fs-16" style="color:#535862;">Protect your assets with Sampul—fast, simple, and secure.</p>
    </div>
    <div class="right-col uui-footer02_right-wrapper">
      <div class="uui-footer02_form-block w-form">
        ${newsletterForm()}
      </div>
    </div>
  </div>
</div>

  <div
  data-w-id="5bf44bd6-19a3-d974-dcf1-e2e7da6c3d3c"
  class="section no-bottom-padding clip bg-white"
>
  <div class="wrapper-corner">
    <footer class="uui-footer02_component">
      <div class="uui-page-padding">
        <div class="uui-container-large">
          <div class="uui-padding-vertical-xlarge">
          <div class="w-layout-grid uui-footer02_top-wrapper" 
            style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;"
          >
          <div class="uui-footer02_left-wrapper-new" 
            style="flex: 0.2; min-width: 320px; display: flex; flex-direction: column; gap: 24px; align-items: flex-start; padding-left: 1rem; text-align: left;"
          > 
          <div class="footer-image" style="width: 150px; max-width: 100%; height: auto;">
            <img src="../images/Logo.svg" alt="Logo" 
              style="width: auto; max-width: 100%; height: auto; object-fit: contain;"
            >
          </div>
          <div class="footer-text" 
            style="font-weight: 400; font-size: 16px; color: #535862; max-width: 300px;"
          >
            <span style="font-weight:700;">Sampul Sdn. Bhd.</span>  <span style="font-size:12px;">1521640-X</span><br>S1-05-17, Vista Alam, Jalan Ikhtisas 14/1, Seksyen 14, 40000 Shah Alam, Malaysia hello@sampul.co | +60 18-976 6429
          </div>
          <a  href="https://www.digitalnewsasia.com/startups/fikra-ace-accelerator-2023-picks-global-psytech-and-pewarisan-winners" >
          <div class="footer-image">
            <img src="static/images/Ratings-badge.svg" alt="Logo" 
              style="width: auto; max-width: 100%; height: auto; object-fit: contain;">
            </div>
          </div>
          </a>
          <!-- Links Section -->
          <div class="uui-footer02_right-wrapper-new" 
            style="display: flex; flex-wrap: wrap; flex: 0.6; max-width: 832px; justify-content: center; gap: 32px; align-items: flex-start; padding: 0 0 30px 0;"
          >    
          <div class="uui-footer02_link-list" 
            style="min-width: 120px; display: flex; flex-direction: column; align-items: flex-start;"
          >
          <div class="uui-footer02_link-list-heading">Product</div>
          <a 
            href="wasiat" 
            class="uui-footer02_link w-inline-block"
          ><div>Sampul Wasiat</div>
          </a>
            <a 
            href="sampul_trust" 
            class="uui-footer02_link w-inline-block"
          ><div class="col-9">Sampul Trust</div>
                         <div class="d-flex align-items-center justify-content-center bg-white col-3" style="border-radius:5px;margin:5px;border: 1px solid var(--Colors-Border-border-primary, #D5D7DA)">
                <span style="font-size:12px;color:gray;">New</span>
                </div>
          </a>
            <a 
            href="sampul_executor" 
            class="uui-footer02_link w-inline-block"
          ><div class="col-9">Sampul Executor</div>
                         <div class="d-flex align-items-center justify-content-center bg-white col-3" style="border-radius:5px;margin:5px;border: 1px solid var(--Colors-Border-border-primary, #D5D7DA)">
                <span style="font-size:12px;color:gray;">New</span>
                </div>
          </a>
        </div>
        <div class="uui-footer02_link-list" 
          style="min-width: 120px; display: flex; flex-direction: column; align-items: flex-start;"
        ><div class="uui-footer02_link-list-heading">Company</div>
          <a href="company" class="uui-footer02_link w-inline-block"><div>About us</div></a>
          <a href="resources" class="uui-footer02_link w-inline-block"><div>Careers</div></a>
          <a href="resources" class="uui-footer02_link w-inline-block"><div>Media kit</div></a>
          <a href="contact" class="uui-footer02_link w-inline-block"><div>Contact</div></a>
        </div>
        <div class="uui-footer02_link-list" style="min-width: 120px; display: flex; flex-direction: column; align-items: flex-start;">
          <div class="uui-footer02_link-list-heading">Resources</div>
            <a href="resources" class="uui-footer02_link w-inline-block"><div>Blog</div></a>
            <a href="resources" class="uui-footer02_link w-inline-block"><div>Help centre</div></a>
            <a href="resources" class="uui-footer02_link w-inline-block"><div>Support</div></a>
          </div>
          <div class="uui-footer02_link-list" style="min-width: 120px; display: flex; flex-direction: column; align-items: flex-start;">
            <div class="uui-footer02_link-list-heading">Legal</div>
              <a href="resources" class="uui-footer02_link w-inline-block"><div>Terms</div></a>
              <a href="resources" class="uui-footer02_link w-inline-block"><div>Privacy</div></a>
              <a href="resources" class="uui-footer02_link w-inline-block"><div>Cookies</div></a>
              <a href="resources" class="uui-footer02_link w-inline-block"><div>Licenses</div></a>
            </div>  
          </div>
        </div>
              <div class="uui-footer02_bottom-wrapper">
                <div class="uui-footer02_legal-list-wrapper">
                  <div class="uui-text-size-small text-color-gray500 hide-on-mobile" style="margin-right:40px;">
                    © 2025 Sampul.co. All rights reserved.
                  </div>               
                  <div class="w-layout-grid uui-footer02_social-list">
                     <a href="#" class="uui-footer02_social-link w-inline-block">
                  <div class="uui-footer02_social-icon w-embed">
                     <svg width="24" 
                       height="24" 
                       viewBox="0 0 24 23" 
                       fill="none" 
                       xmlns="http://www.w3.org/2000/svg"
                  >
                     <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9455 22.7662L10.396 14.8563L3.44886 22.7662H0.509766L9.09209 12.9973L0.509766 0.766174H8.05571L13.286 8.22119L19.8393 0.766174H22.7784L14.5943 10.0827L23.4914 22.7662H15.9455ZM19.2185 20.5362H17.2398L4.71811 2.99617H6.6971L11.7121 10.0193L12.5793 11.238L19.2185 20.5362Z" fill="#A4A7AE"/>
                  </svg>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/company/sampul"
                  class="uui-footer02_social-link w-inline-block"
                >
                  <div class="uui-footer02_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </a>
                  <a href="https://www.facebook.com/hellosampul" class="uui-footer02_social-link w-inline-block">
                    <div class="uui-footer02_social-icon w-embed">
                      <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                        d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                        fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </a>
                <a href="#" class="uui-footer02_social-link w-inline-block">
                  <div class="uui-footer02_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewbox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2.16094C15.2063 2.16094 15.5859 2.175 16.8469 2.23125C18.0188 2.28281 18.6516 2.47969 19.0734 2.64375C19.6313 2.85938 20.0344 3.12188 20.4516 3.53906C20.8734 3.96094 21.1313 4.35938 21.3469 4.91719C21.5109 5.33906 21.7078 5.97656 21.7594 7.14375C21.8156 8.40937 21.8297 8.78906 21.8297 11.9906C21.8297 15.1969 21.8156 15.5766 21.7594 16.8375C21.7078 18.0094 21.5109 18.6422 21.3469 19.0641C21.1313 19.6219 20.8688 20.025 20.4516 20.4422C20.0297 20.8641 19.6313 21.1219 19.0734 21.3375C18.6516 21.5016 18.0141 21.6984 16.8469 21.75C15.5813 21.8063 15.2016 21.8203 12 21.8203C8.79375 21.8203 8.41406 21.8063 7.15313 21.75C5.98125 21.6984 5.34844 21.5016 4.92656 21.3375C4.36875 21.1219 3.96563 20.8594 3.54844 20.4422C3.12656 20.0203 2.86875 19.6219 2.65313 19.0641C2.48906 18.6422 2.29219 18.0047 2.24063 16.8375C2.18438 15.5719 2.17031 15.1922 2.17031 11.9906C2.17031 8.78438 2.18438 8.40469 2.24063 7.14375C2.29219 5.97187 2.48906 5.33906 2.65313 4.91719C2.86875 4.35938 3.13125 3.95625 3.54844 3.53906C3.97031 3.11719 4.36875 2.85938 4.92656 2.64375C5.34844 2.47969 5.98594 2.28281 7.15313 2.23125C8.41406 2.175 8.79375 2.16094 12 2.16094ZM12 0C8.74219 0 8.33438 0.0140625 7.05469 0.0703125C5.77969 0.126563 4.90313 0.332812 4.14375 0.628125C3.35156 0.9375 2.68125 1.34531 2.01563 2.01562C1.34531 2.68125 0.9375 3.35156 0.628125 4.13906C0.332812 4.90313 0.126563 5.775 0.0703125 7.05C0.0140625 8.33437 0 8.74219 0 12C0 15.2578 0.0140625 15.6656 0.0703125 16.9453C0.126563 18.2203 0.332812 19.0969 0.628125 19.8563C0.9375 20.6484 1.34531 21.3188 2.01563 21.9844C2.68125 22.65 3.35156 23.0625 4.13906 23.3672C4.90313 23.6625 5.775 23.8687 7.05 23.925C8.32969 23.9812 8.7375 23.9953 11.9953 23.9953C15.2531 23.9953 15.6609 23.9812 16.9406 23.925C18.2156 23.8687 19.0922 23.6625 19.8516 23.3672C20.6391 23.0625 21.3094 22.65 21.975 21.9844C22.6406 21.3188 23.0531 20.6484 23.3578 19.8609C23.6531 19.0969 23.8594 18.225 23.9156 16.95C23.9719 15.6703 23.9859 15.2625 23.9859 12.0047C23.9859 8.74688 23.9719 8.33906 23.9156 7.05938C23.8594 5.78438 23.6531 4.90781 23.3578 4.14844C23.0625 3.35156 22.6547 2.68125 21.9844 2.01562C21.3188 1.35 20.6484 0.9375 19.8609 0.632812C19.0969 0.3375 18.225 0.13125 16.95 0.075C15.6656 0.0140625 15.2578 0 12 0Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M12 5.83594C8.59688 5.83594 5.83594 8.59688 5.83594 12C5.83594 15.4031 8.59688 18.1641 12 18.1641C15.4031 18.1641 18.1641 15.4031 18.1641 12C18.1641 8.59688 15.4031 5.83594 12 5.83594ZM12 15.9984C9.79219 15.9984 8.00156 14.2078 8.00156 12C8.00156 9.79219 9.79219 8.00156 12 8.00156C14.2078 8.00156 15.9984 9.79219 15.9984 12C15.9984 14.2078 14.2078 15.9984 12 15.9984Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M19.8469 5.59214C19.8469 6.38902 19.2 7.0312 18.4078 7.0312C17.6109 7.0312 16.9688 6.38433 16.9688 5.59214C16.9688 4.79526 17.6156 4.15308 18.4078 4.15308C19.2 4.15308 19.8469 4.79995 19.8469 5.59214Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="https://wa.me/60189766429?text=Hello%20Sampul!" class="uui-footer02_social-link w-inline-block">
                  <div class="uui-footer02_social-icon w-embed">
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 25" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23.2662C17.799 23.2662 22.5 18.5652 22.5 12.7662C22.5 6.96718 17.799 2.26617 12 2.26617C6.20101 2.26617 1.5 6.96718 1.5 12.7662C1.5 14.6493 1.99575 16.4167 2.86386 17.9449L1.5 23.2662L6.98615 21.994C8.47603 22.8053 10.1842 23.2662 12 23.2662ZM12 21.6508C16.9068 21.6508 20.8846 17.673 20.8846 12.7662C20.8846 7.85934 16.9068 3.88156 12 3.88156C7.09316 3.88156 3.11538 7.85934 3.11538 12.7662C3.11538 14.6607 3.70838 16.4168 4.71888 17.8588L3.92308 20.8431L6.95995 20.0839C8.39202 21.0721 10.1284 21.6508 12 21.6508Z" fill="#A4A7AE"/>
                      <path d="M9.37502 7.89115C9.12537 7.38972 8.7424 7.43411 8.35551 7.43411C7.66407 7.43411 6.58594 8.26232 6.58594 9.8037C6.58594 11.0669 7.14259 12.4498 9.01831 14.5183C10.8285 16.5146 13.207 17.5473 15.1817 17.5122C17.1563 17.477 17.5625 15.7778 17.5625 15.204C17.5625 14.9496 17.4047 14.8227 17.296 14.7882C16.6231 14.4653 15.382 13.8636 15.0996 13.7505C14.8172 13.6375 14.6698 13.7904 14.5781 13.8736C14.3221 14.1176 13.8144 14.8368 13.6406 14.9986C13.4668 15.1603 13.2077 15.0785 13.0999 15.0173C12.7031 14.8581 11.6272 14.3795 10.7696 13.5482C9.70899 12.5201 9.64675 12.1663 9.44693 11.8515C9.28707 11.5996 9.40437 11.445 9.46291 11.3775C9.69142 11.1138 10.007 10.7067 10.1485 10.5044C10.29 10.3021 10.1776 9.995 10.1102 9.8037C9.82033 8.98099 9.57474 8.2923 9.37502 7.89115Z" fill="#A4A7AE"/>
                    </svg>
                  </div>
                </a>
                </div>
              </div>
            </div>
             <span class="uui-text-size-small text-color-gray500 hide-on-desktop" style="margin-right:40px;m">
                    © 2025 Sampul.co. All rights reserved.
              </span> 
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>
  `;
}

function newsletterFormAddAPI() {
    document
        .getElementById('add-newsletter-form')
        .addEventListener('submit', async function (event) {
            event.preventDefault();

            let useBtn = document.getElementById('btn-newsletter-add-form');
            let defaultBtnText = useBtn.innerHTML;
            useBtn.disabled = true;
            useBtn.innerHTML = spinnerLoading(useBtn.innerHTML);

            var email_input = document.getElementById('input-newsletter-email');

            try {
                const response = await fetch(
                    `${STATIC_PUBLIC_HOST}/api/newsletter/subscribe`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email_input.value,
                        }),
                    }
                );

                if (!response.ok) {
                    const data = await response.json();
                    showToast('alert-toast-container', data.message, 'danger');
                    useBtn.disabled = false;
                    useBtn.innerHTML = defaultBtnText;

                    return;
                }

                showToast('alert-toast-container', 'Subscribed!', 'success');
            } catch (error) {
                showToast('alert-toast-container', error.message, 'danger');
                useBtn.disabled = false;
                useBtn.innerHTML = defaultBtnText;
            }

            useBtn.disabled = false;
            useBtn.innerHTML = defaultBtnText;
        });
}
