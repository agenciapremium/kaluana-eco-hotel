/**
 * Script inline que roda antes da primeira pintura:
 * 1. marca html.js (o CSS de movimento só vale com JavaScript; sem ele, nada fica invisível);
 * 2. decide se a abertura de sessão toca: uma vez por sessão, nunca com movimento reduzido,
 *    nunca nas páginas do Universo nem no atalho do QR.
 */
const code = `(function(){var d=document.documentElement;d.classList.add('js');try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=window.sessionStorage.getItem('kaluana:abertura');var uni=/^\\/(universo|q)(\\/|$)/.test(window.location.pathname);if(!rm&&!seen&&!uni){d.setAttribute('data-opening','1');window.sessionStorage.setItem('kaluana:abertura','1');}}catch(e){}})();`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
