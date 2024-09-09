// const formConfigs = [
//   {
//     lang:"bm",
//     containerId: 'footer-container',
//     formFunction: BI_footer,
//   },
//   {
//     lang:'en',
//     containerId: 'footer_BM',
//     formFunction: BM_footer,
//   }
// ];


const hello = () => {
    const lang = localStorage.getItem('lang')
    const bm = [{
      containerId: 'footer-container',
      formFunction: BM_footer,
    }]

    const en = [{
      containerId: 'footer_BM',
      formFunction: BM_footer
      }]
    if (lang === 'bm') {
      console.log('in bm',bm)
      return bm
    } else {
      console.log('in bi',en)
      return en
    }
}

const haha = hello()
console.log('hahah' , haha)

haha.forEach(async (item) => {

  const element = document.getElementById(item.containerId);

  const isBM = element === "BI_footer"

  if (element) {
    element.innerHTML = item.formFunction();
  } else {
    console.error(`Element with ID ${item.containerId} not found.`);
  }
});

newsletterFormAddAPI();
