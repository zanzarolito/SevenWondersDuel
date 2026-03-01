/**
 * shared-data.js — Source unique pour les données de jeu partagées
 * entre le serveur (Node.js / require) et le client (navigateur / script tag).
 *
 * Navigateur  : définit les globales WONDER_DATA et PROGRESS_DATA
 * Node.js     : les exporte via module.exports
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    const data = factory();
    root.WONDER_DATA    = data.WONDER_DATA;
    root.PROGRESS_DATA  = data.PROGRESS_DATA;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  const WONDER_DATA = [
    { id:'circus_maximus',     name:'Circus Maximus',        cost:{stone:2,wood:1,glass:1},           effects:[{type:'destroy_card',color:'gray'},{type:'shields',amount:1},{type:'vp',amount:3}],                          desc:'Détruire 1 carte grise adverse. +1 bouclier. +3 PV.' },
    { id:'colosse',            name:'Colosse',               cost:{clay:3,glass:1},                   effects:[{type:'shields',amount:2},{type:'vp',amount:3}],                                                              desc:'+2 boucliers. +3 PV.' },
    { id:'grand_phare',        name:'Grand Phare',           cost:{clay:1,stone:1,papyrus:2},         effects:[{type:'produce_choice',res:['stone','clay','wood']},{type:'vp',amount:4}],                                    desc:'Produit Pierre/Argile/Bois au choix. +4 PV.' },
    { id:'jardins_suspendus',  name:'Jardins Suspendus',     cost:{clay:2,glass:1,papyrus:1},         effects:[{type:'coins',amount:6},{type:'replay'},{type:'vp',amount:3}],                                                desc:'+6 pièces. Rejouer. +3 PV.' },
    { id:'grande_bibliotheque',name:'Grande Bibliothèque',   cost:{wood:3,glass:1,papyrus:1},         effects:[{type:'choose_progress'},{type:'vp',amount:4}],                                                               desc:'Choisir 1 jeton Progrès parmi 3 écartés. +4 PV.' },
    { id:'mausolee',           name:'Mausolée',              cost:{clay:2,glass:2,papyrus:1},         effects:[{type:'build_discard'},{type:'vp',amount:2}],                                                                 desc:'Construire gratuitement une carte de la défausse. +2 PV.' },
    { id:'piree',              name:'Pirée',                 cost:{wood:2,stone:1,clay:1},            effects:[{type:'produce_choice',res:['glass','papyrus']},{type:'replay'},{type:'vp',amount:2}],                        desc:'Produit Verre/Papyrus au choix. Rejouer. +2 PV.' },
    { id:'pyramides',          name:'Pyramides',             cost:{stone:3,papyrus:1},                effects:[{type:'vp',amount:9}],                                                                                        desc:'+9 PV.' },
    { id:'sphinx',             name:'Sphinx',                cost:{clay:1,stone:1,glass:2},           effects:[{type:'replay'},{type:'vp',amount:6}],                                                                        desc:'Rejouer. +6 PV.' },
    { id:'statue_de_zeus',     name:'Statue de Zeus',        cost:{clay:1,wood:1,papyrus:2,stone:1},  effects:[{type:'destroy_card',color:'brown'},{type:'shields',amount:1},{type:'vp',amount:3}],                          desc:'Détruire 1 carte marron adverse. +1 bouclier. +3 PV.' },
    { id:'temple_artemis',     name:"Temple d'Artémis",      cost:{wood:1,stone:1,glass:1,papyrus:1}, effects:[{type:'coins',amount:12},{type:'replay'}],                                                                    desc:'+12 pièces. Rejouer.' },
    { id:'via_appia',          name:'Via Appia',             cost:{stone:2,clay:2,papyrus:1},         effects:[{type:'coins',amount:3},{type:'opponent_coins',amount:-3},{type:'replay'},{type:'vp',amount:3}],              desc:'+3 pièces. Adversaire perd 3 pièces. Rejouer. +3 PV.' },
  ];

  const PROGRESS_DATA = [
    { id:'agriculture',    name:'Agriculture',    icon:'🌾', effect:'Prendre 6 pièces. +4 PV fin de partie.' },
    { id:'architecture',   name:'Architecture',   icon:'🏛', effect:'Prochaines Merveilles coûtent 2 ressources de moins.' },
    { id:'economie',       name:'Économie',       icon:'💹', effect:"Récupérer les pièces que l'adversaire paie pour acheter des ressources." },
    { id:'loi',            name:'Loi',            icon:'⚖',  effect:'Apporte 1 symbole scientifique.' },
    { id:'maconnerie',     name:'Maçonnerie',     icon:'🧱', effect:'Prochains bâtiments civils (bleus) coûtent 2 ressources de moins.' },
    { id:'mathematiques',  name:'Mathématiques',  icon:'📐', effect:'+3 PV par jeton Progrès en possession (ce jeton compris).' },
    { id:'philosophie',    name:'Philosophie',    icon:'📜', effect:'+7 PV en fin de partie.' },
    { id:'strategie',      name:'Stratégie',      icon:'♟',  effect:'Prochains bâtiments militaires ont +1 bouclier supplémentaire.' },
    { id:'theologie',      name:'Théologie',      icon:'✝',  effect:"Prochaines Merveilles ont l'effet Rejouer." },
    { id:'urbanisme',      name:'Urbanisme',      icon:'🏙', effect:'+6 pièces maintenant. Chaque construction gratuite par chaînage rapporte +4 pièces.' },
  ];

  return { WONDER_DATA, PROGRESS_DATA };
}));
