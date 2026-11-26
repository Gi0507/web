export function resolverImagemProduto(nome?: string): string {
  const n = (nome || '').toLowerCase().trim();

  // Linha Omnitrix (public/relogios/ominitrix/)
  if (n.includes('ultimatrix')) return 'relogios/ominitrix/ominitrix 3.webp';
  if (n.includes('omnitrix') && n.includes('custom')) return 'relogios/ominitrix/ominitrix2.webp';
  if (n.includes('omnitrix')) return 'relogios/ominitrix/ominitrix.webp';

  // Linha G-Shock / Casio (public/relogios/)
  if (n.includes('dw-6900')) return 'relogios/dw-6900.avif';
  if (n.includes('7900')) return 'relogios/g-7900a-4dr_1.png';
  if (n.includes('gba-900')) return 'relogios/gba-900CB.avif';
  if (n.includes('gba-950')) return 'relogios/gba-950.avif';
  if (n.includes('gmw') || n.includes('b5000')) return 'relogios/gmw5000.avif';
  if (n.includes('edifice')) return 'relogios/casio-edifice.png';

  // Linha Rolex (public/relogios/)
  if (n.includes('datejust')) return 'relogios/rolex3.webp';
  if (n.includes('oyster')) return 'relogios/rolex4.webp';
  if (n.includes('daytona')) return 'relogios/rolex5.webp';
  if (n.includes('rolex')) return 'relogios/rolex1.webp';

  // Smartwatches (public/relogios/)
  if (n.includes('apple')) return 'relogios/Aplewhat.webp';
  if (n.includes('galaxy')) return 'relogios/galaxy-watch-ultra.png';
  if (n.includes('garmin') || n.includes('forerunner')) return 'relogios/garmin-forerunner.png';
  if (n.includes('kit') || n.includes('fone')) return 'relogios/promoção smartwath e fone.webp';
  if (n.includes('smart')) return 'relogios/smartwhat.webp';

  // Demais modelos da pasta public/relogios/
  if (n.includes('citizen')) return 'relogios/citizen-silhouette.png';
  if (n.includes('vivara')) return 'relogios/vivara-dourado.png';
  if (n.includes('bulova')) return 'relogios/bulova-surveyor.png';
  if (n.includes('tag heuer') || n.includes('tag-heuer') || n.includes('formula 1')) return 'relogios/tag-heuer-f1.png';
  if (n.includes('orient') || n.includes('bambino')) return 'relogios/orient-bambino.png';
  if (n.includes('omega') || n.includes('seamaster')) return 'relogios/omega-seamaster.png';
  if (n.includes('presage')) return 'relogios/seiko-presage.png';
  if (n.includes('prospex') || n.includes('seiko')) return 'relogios/seiko-prospex-diver.png';
  if (n.includes('fossil') || n.includes('jacqueline')) return 'relogios/fossil-jacqueline.png';
  if (n.includes('michael kors') || n.includes('mk') || n.includes('parker')) return 'relogios/mk-parker-rose.png';
  if (n.includes('tissot') || n.includes('prx')) return 'relogios/tissot-prx.png';

  return 'relogios/dw-6900.avif';
}
