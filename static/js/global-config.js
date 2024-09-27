const formConfigs = [
  {
    containerId: 'footer-container',
    formFunction: footer,
  }
];

formConfigs.forEach((item) => {
  const element = document.getElementById(item.containerId);

  const isBM = element === "BI_footer"

  if (element) {
    element.innerHTML = item.formFunction();
  } else {
    console.error(`Element with ID ${item.containerId} not found.`);
  }
});

newsletterFormAddAPI();
