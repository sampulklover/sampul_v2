import Link from 'next/link';

const BelovedCard = ({ title }) => {
  return (
    <div class="accordion" id="accordion1">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <h3 class="heading-xsmall">{title}</h3>
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordion1"
        >
          <div>
            <table class="table table-hover mb-0">
              <tbody>
                {summary.data.map((item, index) => {
                  const rObject = relationships().find(
                    (x) => x.value === item.relationship
                  );
                  const lObject = belovedLevel().find(
                    (x) => x.value === item.level
                  );

                  return (
                    <tr key={index}>
                      <div class="d-flex flex-wrap table-hover py-3 ps-3 px-3">
                        <div class="dp-image-wrapper">
                          <img
                            loading="lazy"
                            src="https://image.pngaaa.com/291/5335291-middle.png"
                            alt=""
                            class="dp-image"
                          />
                        </div>
                        <div class="flex-grow-1">
                          <div class="smpl_text-sm-semibold crop-text">
                            <span>{item.nickname}</span>
                          </div>
                          <div class="smpl_text-sm-regular crop-text">
                            <span>{rObject.name}</span>
                          </div>
                        </div>
                        <div class="beloved-tag">
                          <div class="badge is-badge-small">
                            <span>{lObject.name}</span>
                          </div>
                        </div>
                      </div>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BelovedCard;
