import React from 'react';

const Stepper = ({ steps, currentStep, nextStep, prevStep }) => {
  const primaryColor = '#DDD8FB';
  const secondaryColor = '#2F1DA9';

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stepperStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0',
    margin: '0',
    listStyle: 'none',
    width: '100%',
    position: 'relative',
  };

  const stepperItemStyles = (isActive, isCompleted) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    color: isCompleted || isActive ? primaryColor : '#6c757d',
    paddingBottom: isActive ? '5px' : '0',
  });

  const stepCircleStyles = (isActive, isCompleted) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: isCompleted
      ? primaryColor
      : isActive
      ? primaryColor
      : '#e9ecef',
    color: isCompleted || isActive ? secondaryColor : '#000',
    fontWeight: isActive ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    fontSize: isActive ? '24px' : '18px',
    zIndex: '1',
    border: isActive ? `2px solid ${secondaryColor}` : 'none', // Added border for active step
  });

  const stepLineStyles = (isCompleted) => ({
    position: 'absolute',
    top: '25px',
    left: 'calc(50% + 25px)', // Adjusted for larger circles
    right: '-50%',
    height: '4px',
    backgroundColor: isCompleted ? primaryColor : '#e9ecef',
    zIndex: '0',
  });

  const stepperTitle = (isActive, isCompleted) => ({
    color: isCompleted || isActive ? secondaryColor : '#000',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div style={containerStyles}>
      <div style={{ width: '80%' }}>
        <ul style={stepperStyles}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;
            return (
              <li key={index} style={stepperItemStyles(isActive, isCompleted)}>
                <div style={stepCircleStyles(isActive, isCompleted)}>
                  {step.stepIcon ? step.stepIcon : index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div style={stepLineStyles(isCompleted)} />
                )}
                <div
                  style={stepperTitle(isActive, isCompleted)}
                  class="text-center"
                >
                  <small>{step.title}</small>
                  {isCompleted ? (
                    <i class="bi bi-check-circle-fill text-success ms-1 h5"></i>
                  ) : (
                    ''
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={prevStep}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          aria-label="Next step"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default Stepper;
