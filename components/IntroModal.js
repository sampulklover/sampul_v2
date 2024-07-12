import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const IntroModal = () => {
  const { locale } = useLocale();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      $('#intro-modal').on('hidden.bs.modal', () => {
        setShowVideo(false);
      });

      return () => {
        $('#intro-modal').off('hidden.bs.modal');
      };
    }, 1000);
  }, []);

  return (
    <div class="modal fade" id="intro-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <div style={{ height: 300 }}>
              {showVideo ? (
                <YouTube
                  videoId={'bABdqQPE1VU'} // defaults -> ''
                  id="video-player" // defaults -> ''
                  opts={{
                    height: 300,
                    width: '100%',
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  // className={string} // defaults -> ''
                  // iframeClassName={string} // defaults -> ''
                  title="Unlocking Your Digital Legacy: Introducing Sampul - Your Hassle-Free Digital Will Platform"
                  // loading={string} // defaults -> undefined
                  // opts={obj} // defaults -> {}
                  // onReady={func} // defaults -> noop
                  // onPlay={func} // defaults -> noop
                  // onPause={func} // defaults -> noop
                  onEnd={() => {
                    setTimeout(() => {
                      $('#intro-modal')?.modal('hide');
                    }, 1000);
                  }} // defaults -> noop
                  // onError={func} // defaults -> noop
                  // onStateChange={func} // defaults -> noop
                  // onPlaybackRateChange={func} // defaults -> noop
                  // onPlaybackQualityChange={func} // defaults -> noop
                />
              ) : (
                <>
                  <img
                    class="pointer-on-hover"
                    style={{ height: '100%', width: '100%' }}
                    src="images/sampul-video-player.png"
                    onClick={() => {
                      setShowVideo(true);
                    }}
                  />
                </>
              )}
            </div>

            <div class="my-4">
              <h5>
                <strong>
                  {translations[locale].component.intro_modal.welcome_to_your_}
                </strong>
              </h5>
              <h6 class="text-muted">
                {translations[locale].component.intro_modal.we_glad_to_}
              </h6>
            </div>
            <div class="row">
              <div class="col">
                <button
                  class="btn btn-light bg-white btn-text w-100"
                  onClick={() => {
                    setShowVideo(false);
                    $('#intro-modal')?.modal('hide');
                  }}
                >
                  {translations[locale].component.intro_modal.skip}
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-primary btn-text w-100"
                  onClick={() => {
                    setShowVideo(true);
                  }}
                >
                  {translations[locale].component.intro_modal.start_video_tour}
                </button>
              </div>
            </div>

            <div class="row">
              <div class="col mt-sm-0 mt-3">
                <div class="row">
                  <div class="col"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;

// The summary of this page includes:
// This page is designed to display a modal window with dynamic content.
// The modal can show either an embedded YouTube video or a placeholder image, based on user interaction.
// There are buttons to skip the video or start a video tour, which toggle the visibility of the video player.
