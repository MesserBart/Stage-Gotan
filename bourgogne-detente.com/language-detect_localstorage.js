
actualLang=(localStorage.getItem('lang'));
 if (actualLang==null) {
  localStorage.setItem('lang','fr');
 }
function redirect(actuallang){
  var url ='/';
  switch(actualLang){
    case 'en':
      url ='en.html';
      break;
    case 'fr':
      url ='fr.html';
      break;
    case 'es':
      url ='es.html';
      break;
    case 'de':
      url ='de.html';
      break;
    default:
      url='fr.html';
      break;
  }
  window.location.replace(url);
}