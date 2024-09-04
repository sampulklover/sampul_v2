import React from 'react';

const Stepper = ({ steps, currentStep, nextStep, prevStep }) => {
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
    color: isCompleted || isActive ? '#0d6efd' : '#6c757d',
  });

  const stepCircleStyles = (isActive, isCompleted) => ({
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: isCompleted ? '#0d6efd' : isActive ? '#0d6efd' : '#e9ecef',
    color: isCompleted || isActive ? '#fff' : '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    fontSize: '18px',
    zIndex: '1',
  });

  const stepLineStyles = (isCompleted) => ({
    position: 'absolute',
    top: '25px',
    left: 'calc(50% + 25px)', // Adjusted for larger circles
    right: '-50%',
    height: '4px',
    backgroundColor: isCompleted ? '#0d6efd' : '#e9ecef',
    zIndex: '0',
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
                  {index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div style={stepLineStyles(isCompleted)} />
                )}
                <div>{step.title}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="d-flex justify-content-between mt-4">
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
      </div>
    </div>
  );
};

export default Stepper;
