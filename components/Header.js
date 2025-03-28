import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import Link from 'next/link';

const Footer = () => {
  const { locale } = useLocale();

  return (
    <footer>
      <div>
        <div>
          <div>
            <div class="w-layout-grid footer04_top-wrapper">
              <a
                id="w-node-_39a9dddd-9d69-0458-a544-0811b81ec9fb-b81ec9f6"
                href="#"
                class="footer04_logo-link w-inline-block"
              >
                <div class="logo_component">
                  <div class="w-embed">
                    <svg
                      width="152"
                      height="24"
                      viewBox="0 0 152 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_dd_5102_518466)">
                        <g clipPath="url(#clip0_5102_518466)">
                          <path
                            d="M34.9999 16.4957V28.5383C34.9999 29.5533 34.4504 30.1384 33.6357 30.1384C33.3137 30.1384 32.9348 30.0352 32.5369 29.8287V17.786C32.5369 16.358 31.4381 14.6205 30.0741 13.9151L10.3901 3.59283C10.3901 2.1649 11.489 1.59718 12.853 2.30253L32.5369 12.6248C33.901 13.3302 34.9999 15.0677 34.9999 16.4957Z"
                            fill="#BFB7F4"
                          ></path>
                          <path
                            d="M32.5298 17.7847V29.8274C32.5298 30.8425 31.9804 31.4274 31.1658 31.4274C30.8437 31.4274 30.4648 31.3241 30.067 31.1176V19.075C30.067 17.6471 28.9681 15.9095 27.6041 15.2041L7.92017 4.88188C7.92017 3.45395 9.01894 2.88623 10.383 3.59162L30.067 13.9139C31.431 14.6192 32.5298 16.3568 32.5298 17.7847Z"
                            fill="#8D7FEF"
                          ></path>
                          <path
                            d="M30.0696 19.0751V31.1177C30.0696 32.1327 29.5202 32.7176 28.7056 32.7176C28.3835 32.7176 28.0046 32.6143 27.6067 32.4078V20.3654C27.6067 18.9374 26.508 17.1998 25.1439 16.4945L5.45996 6.17222C5.45996 5.15721 6.00937 4.57227 6.824 4.57227C7.16504 4.57227 7.52497 4.67549 7.92282 4.88192L27.6067 15.2042C28.9708 15.9096 30.0696 17.6472 30.0696 19.0751Z"
                            fill="#533DE9"
                          ></path>
                          <path
                            d="M25.1439 16.4951L17.0544 20.7617C16.9028 20.8305 16.7323 20.8821 16.5618 20.8993H16.3344C15.4061 20.8477 14.3073 20.1079 13.5495 18.9209L5.45996 6.17285L25.1439 16.4951Z"
                            fill="#BFB7F4"
                          ></path>
                          <path
                            d="M27.6096 20.3641V32.4069C27.6096 33.8346 26.5108 34.4024 25.1468 33.6971L5.46286 23.3748C4.09882 22.6694 3 20.9318 3 19.5039V7.46128C3 6.44624 3.54941 5.86133 4.36404 5.86133C4.70504 5.86133 5.06501 5.96455 5.46286 6.17099L13.5524 18.919C14.3102 20.106 15.409 20.8458 16.3373 20.8974H16.5647C16.7352 20.8802 16.9057 20.8286 17.0572 20.7598L25.1468 16.4933C26.5108 17.1986 27.6096 18.9362 27.6096 20.3641Z"
                            fill="#2F1DA9"
                          ></path>
                        </g>
                      </g>
                      <g clipPath="url(#clip1_5102_518466)">
                        <path
                          d="M77.6134 26.137H73.7091V24.2376C72.5748 25.3983 70.9392 26.137 68.9607 26.137C65.6631 26.137 63.5791 24.2112 63.5791 21.4941C63.5791 18.6978 65.8478 16.9567 69.4619 16.9567H73.3662V16.2708C73.3662 14.5297 72.3637 13.5272 70.4644 13.5272C68.8552 13.5272 67.7208 14.1867 66.349 15.664L64.1595 13.0524C65.9533 10.9156 68.222 9.83398 70.9656 9.83398C75.0282 9.83398 77.6398 12.1818 77.6398 16.5082V26.137H77.6134ZM73.3662 19.753H70.0423C68.6705 19.753 67.8791 20.2806 67.8791 21.3358C67.8791 22.391 68.7496 23.0241 70.1214 23.0241C71.968 23.0241 73.3926 21.7315 73.3926 19.9376V19.753H73.3662Z"
                          fill="#533DE9"
                        ></path>
                        <path
                          d="M128.551 9.83398H132.877V19.0935C132.877 20.9137 134.143 22.1535 135.911 22.1535C137.573 22.1535 138.865 20.9401 138.865 19.0935V9.83398H143.192V18.7242C143.192 23.156 140.053 26.1106 135.885 26.1106C131.637 26.1106 128.524 23.156 128.524 18.7242V9.83398H128.551Z"
                          fill="#533DE9"
                        ></path>
                        <path
                          d="M147.097 2H151.344V25.584H147.097V2Z"
                          fill="#533DE9"
                        ></path>
                        <path
                          d="M106.289 17.0623V25.9525H101.937V16.7193C101.937 14.8991 100.67 13.6592 98.9293 13.6592C97.2673 13.6592 95.9747 14.8727 95.9747 16.7193V25.9789H91.4373V16.7193C91.4373 14.8991 90.171 13.6592 88.4299 13.6592C86.7679 13.6592 85.4753 14.8727 85.4753 16.7193V25.9789H81.1226V17.0623C81.1226 12.6304 84.2618 9.67578 88.4299 9.67578C90.5667 9.67578 92.4133 10.4144 93.7323 11.7334C95.025 10.4144 96.8716 9.67578 98.9557 9.67578C103.15 9.67578 106.289 12.6304 106.289 17.0623Z"
                          fill="#533DE9"
                        ></path>
                        <path
                          d="M117.212 9.8625C112.649 9.75698 108.771 13.5557 108.85 17.9876C108.85 18.0404 108.85 18.0932 108.85 18.1459V34.0004H113.097V25.1367C114.311 25.7962 115.709 26.1655 117.16 26.1391C121.723 26.2446 125.654 22.4195 125.575 17.9876C125.68 13.5294 121.776 9.78336 117.212 9.8625ZM117.212 22.2348C114.838 22.2348 113.097 20.4146 113.097 17.9876C113.097 15.5079 114.838 13.7404 117.212 13.7404C119.507 13.7404 121.249 15.587 121.249 18.014C121.249 20.441 119.507 22.2348 117.212 22.2348Z"
                          fill="#533DE9"
                        ></path>
                        <path
                          d="M48.5441 18.1448C50.0214 20.176 51.6569 21.4423 54.1367 21.4423C56.168 21.4423 57.3815 20.4662 57.3815 18.9362C57.3815 17.5908 56.6692 17.1159 54.4796 16.1135L52.0263 15.0055C48.5441 13.4491 46.5128 11.4705 46.5128 8.4368C46.5128 4.55889 49.7312 2 54.0576 2C57.5398 2 60.1514 3.68834 61.5759 6.29999L58.4103 8.75336C57.2496 6.98588 55.7987 6.14171 54.0576 6.14171C52.4484 6.14171 51.2349 6.93312 51.2349 8.35766C51.2349 9.57115 51.9471 10.1251 53.8993 10.9693L56.4845 12.1037C60.3097 13.792 62.1036 15.6914 62.1036 18.7515C62.1036 22.9196 58.7005 25.584 54.1367 25.584C50.2852 25.584 47.0932 23.6055 45.3521 20.5454L48.5441 18.1448Z"
                          fill="#533DE9"
                        ></path>
                      </g>
                      <defs>
                        <filter
                          id="filter0_dd_5102_518466"
                          x="0"
                          y="0"
                          width="39.3521"
                          height="38"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          >
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            >
                              <feOffset dy="1">
                                <feGaussianBlur stdDeviation="1">
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"
                                  >
                                    <feBlend
                                      mode="normal"
                                      in2="BackgroundImageFix"
                                      result="effect1_dropShadow_5102_518466"
                                    >
                                      <feColorMatrix
                                        in="SourceAlpha"
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        result="hardAlpha"
                                      >
                                        <feOffset dy="1">
                                          <feGaussianBlur stdDeviation="1.5">
                                            <feColorMatrix
                                              type="matrix"
                                              values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"
                                            >
                                              <feBlend
                                                mode="normal"
                                                in2="effect1_dropShadow_5102_518466"
                                                result="effect2_dropShadow_5102_518466"
                                              >
                                                <feBlend
                                                  mode="normal"
                                                  in="SourceGraphic"
                                                  in2="effect2_dropShadow_5102_518466"
                                                  result="shape"
                                                ></feBlend>
                                              </feBlend>
                                            </feColorMatrix>
                                          </feGaussianBlur>
                                        </feOffset>
                                      </feColorMatrix>
                                    </feBlend>
                                  </feColorMatrix>
                                </feGaussianBlur>
                              </feOffset>
                            </feColorMatrix>
                          </feFlood>
                        </filter>
                        <clipPath id="clip0_5102_518466">
                          <rect
                            x="3"
                            y="2"
                            width="32"
                            height="32"
                            rx="8"
                            fill="white"
                          ></rect>
                        </clipPath>
                        <clipPath id="clip1_5102_518466">
                          <rect
                            width="105.99"
                            height="32"
                            fill="white"
                            transform="translate(45.3521 2)"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </a>
              <div
                id="w-node-_39a9dddd-9d69-0458-a544-0811b81eca12-b81ec9f6"
                class="w-layout-grid footer_social-list"
              >
                <a href="#" class="footer04_social-link w-inline-block">
                  <div class="footer04_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
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
                <a href="#" class="footer04_social-link w-inline-block">
                  <div class="footer04_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
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
                <a href="#" class="footer04_social-link w-inline-block">
                  <div class="footer04_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.55016 21.75C16.6045 21.75 21.5583 14.2467 21.5583 7.74186C21.5583 7.53092 21.5536 7.3153 21.5442 7.10436C22.5079 6.40746 23.3395 5.54425 24 4.5553C23.1025 4.9546 22.1496 5.21538 21.1739 5.32874C22.2013 4.71291 22.9705 3.74547 23.3391 2.60577C22.3726 3.17856 21.3156 3.58261 20.2134 3.80061C19.4708 3.01156 18.489 2.48912 17.4197 2.31405C16.3504 2.13899 15.2532 2.32105 14.2977 2.8321C13.3423 3.34314 12.5818 4.15471 12.1338 5.14131C11.6859 6.12792 11.5754 7.23462 11.8195 8.2903C9.86249 8.19209 7.94794 7.6837 6.19998 6.7981C4.45203 5.91249 2.90969 4.66944 1.67297 3.14952C1.0444 4.23324 0.852057 5.51565 1.13503 6.73609C1.418 7.95654 2.15506 9.02345 3.19641 9.71999C2.41463 9.69517 1.64998 9.48468 0.965625 9.10592V9.16686C0.964925 10.3041 1.3581 11.4066 2.07831 12.2868C2.79852 13.167 3.80132 13.7706 4.91625 13.995C4.19206 14.1931 3.43198 14.222 2.69484 14.0794C3.00945 15.0574 3.62157 15.9129 4.44577 16.5263C5.26997 17.1398 6.26512 17.4806 7.29234 17.5012C5.54842 18.8711 3.39417 19.6141 1.17656 19.6106C0.783287 19.61 0.390399 19.5859 0 19.5384C2.25286 20.9837 4.87353 21.7514 7.55016 21.75Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="#" class="footer04_social-link w-inline-block">
                  <div class="footer04_social-icon w-embed">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
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
              </div>
            </div>
            <div class="footer04_bottom-wrapper">
              <div class="text-size-small text-color-gray500">
                © 2023 Sampul.co
              </div>
              <div class="w-layout-grid footer_legal-list">
                <a href="#" class="footer_legal-link">
                  {translations[locale].component.header.terms}
                </a>
                <a href="#" class="footer_legal-link">
                  {translations[locale].component.header.privacy}
                </a>
                <a href="#" class="footer_legal-link">
                  {translations[locale].component.header.cookies}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// The summary of this page includes:
// This page features a footer section that includes a logo and social media icons.
// The footer's layout uses grids and links are embedded using SVG graphics.
