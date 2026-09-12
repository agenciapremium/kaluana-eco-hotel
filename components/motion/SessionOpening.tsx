import { getVideo } from "@/lib/media";
import { motion as tokens } from "@/lib/tokens";

const video = getVideo("abertura");

/**
 * Abertura de sessão: a logo animada toca sobre bege por no máximo 1,8 s, com botão de pular.
 *
 * Quem decide se ela toca é o BootScript (data-opening no html), antes da pintura. Toda a
 * lógica fica em um script inline logo após a marcação, sem esperar o bundle: o vídeo começa
 * a baixar imediatamente e a abertura termina por "ended", pelo teto de 1,8 s, por Pular ou
 * por Esc. A marcação vai por innerHTML para o React não reconciliar as fontes do vídeo.
 * O vídeo é pedido logo depois da primeira pintura, para não atrasar o LCP.
 * O poster é o último quadro da animação: em conexão lenta, aparece a logo estática.
 */
const markup = `<video class="opening-video" muted playsinline preload="none" poster="${video.poster}" width="${video.width}" height="${video.height}" aria-hidden="true"></video><button type="button" class="opening-skip" data-skip>Pular</button>`;

const sources = [
  [video.webm, 'video/webm; codecs="vp9"'],
  ...(video.hevcAlpha ? [[video.hevcAlpha, 'video/mp4; codecs="hvc1"']] : []),
  [video.mp4, "video/mp4"],
];

const script = `(function(){var d=document.documentElement;if(d.getAttribute('data-opening')!=='1')return;var w=document.getElementById('abertura');var v=w&&w.querySelector('video');if(!w||!v){d.removeAttribute('data-opening');return;}var done=false;function fin(){if(done)return;done=true;w.setAttribute('data-state','leaving');setTimeout(function(){d.removeAttribute('data-opening');w.setAttribute('data-state','done');try{v.pause();}catch(e){}},${tokens.duration.short});}
var b=w.querySelector('[data-skip]');if(b){b.addEventListener('click',fin);}document.addEventListener('keydown',function(e){if(e.key==='Escape'){fin();}});setTimeout(fin,${tokens.duration.opening + 300});
requestAnimationFrame(function(){setTimeout(function(){if(done){return;}${JSON.stringify(sources)}.forEach(function(s){var e=document.createElement('source');e.src=s[0];e.type=s[1];v.appendChild(e);});v.load();var p=v.play();if(p&&p.catch){p.catch(fin);}v.addEventListener('ended',fin);},0);});})();`;

export function SessionOpening() {
  return (
    <>
      <div
        id="abertura"
        className="opening"
        data-state="idle"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
