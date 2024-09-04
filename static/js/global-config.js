const formConfigs = [
  {
    containerId: 'footer-container',
    formFunction: footer,
  },
  {
    containerId: 'footer_BM',
    formFunction: BM_footer,
  }
];

formConfigs.forEach((item) => {
  const element = document.getElementById(item.containerId);
  if (element) {
    element.innerHTML = item.formFunction(); // Call the function here
  } else {
    console.error(`Element with ID ${item.containerId} not found.`);
  }
});

newsletterFormAddAPI();
