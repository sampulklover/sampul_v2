const formConfigs = [
  {
    containerId: 'footer-container',
    formFunction: footer(),
  },
];

formConfigs.forEach((item) => {
  console.log('item ==', item)
  // document.getElementById(item.containerId).innerHTML = item.formFunction;
});

newsletterFormAddAPI();
