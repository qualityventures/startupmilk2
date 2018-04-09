export const TITLE_BASE = 'startupmilk';
export const TITLE_SEPARATOR = '|';
export const API_HOST = 'http://localhost:3019/';
export const JWT_SECRET = '';
export const ANALYTICS = [
  `<!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111430722-2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-111430722-2');
  </script>`,
];
export const MONGO = {
  url: 'mongodb://localhost:27017/milkicons',
  options: {},
};
