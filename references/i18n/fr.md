# Language pack — Français (`fr`)

One row per schema field, in schema order. Read this pack when the conversation is in
French and you need to map the user's words to a field, or to label fields in a rendering.

- **Field** is the key written in the journey file. Keys are always these schema names,
  in every language; never write a label or a synonym as a key.
- **Label** is the display name: column headers, legends and field names in renderings
  and written expressions.
- **Also called** lists words people use for the same concept. When the user's word is
  here, use that row's field. When it fits two rows, ask which one they mean.
- Field values (what the user said) are not translated unless the user asks.
- A custom field has no row. Label it from its registered description, in French.
- `journey.sh validate` reads these packs: a key that matches a label or synonym is
  rejected with the field to use instead.

| Field | Label | Also called |
|---|---|---|
| `journey` | Parcours | nom du parcours, parcours client |
| `created` | Créé le | date de création |
| `last-modified` | Modifié le | dernière modification |
| `personas` | Personas | personnages |
| `id` | Identifiant | ID |
| `title` | Titre | nom |
| `description` | Description | résumé |
| `persona` | Persona | acteur, qui |
| `milestone` | Phase | jalon, étape du parcours |
| `emotion` | Émotion | ressenti, sentiment, humeur |
| `emotionValence` | Score émotionnel | valence, note émotionnelle |
| `emotionIntensity` | Intensité émotionnelle | intensité |
| `thinking` | Pensées | ce qu'il pense, monologue intérieur, modèle mental |
| `cognitiveLoad` | Charge cognitive | charge mentale, complexité |
| `motivation` | Motivation | moteur, objectif |
| `anxiety` | Inquiétude | anxiété, peur, doute, crainte |
| `expectation` | Attentes | ce qu'il attend |
| `trust` | Confiance | crédibilité |
| `effort` | Effort | effort perçu, pénibilité |
| `confidence` | Assurance | confiance en soi, certitude |
| `informationNeed` | Besoin d'information | information manquante, question |
| `channel` | Canal | moyen |
| `touchpoint` | Point de contact | point d'interaction, écran |
| `device` | Appareil | terminal |
| `place` | Lieu | endroit |
| `environment` | Environnement | contexte, cadre |
| `physicalEvidence` | Preuve physique | élément tangible, support physique |
| `channelTransition` | Changement de canal | passage d'un canal à l'autre, cross-canal |
| `duration` | Durée | temps passé |
| `waitTime` | Temps d'attente | file d'attente, délai d'attente |
| `frequency` | Fréquence | à quelle fréquence, récurrence |
| `trigger` | Déclencheur | élément déclencheur, cause |
| `deadline` | Échéance | date limite, pression temporelle, urgence |
| `pacing` | Rythme | cadence |
| `coActors` | Autres personnes impliquées | co-acteurs, accompagnants |
| `frontlineStaff` | Personnel en contact | personnel de première ligne, conseiller, agent d'accueil |
| `backstageStaff` | Personnel en coulisses | back-office |
| `responsibleTeam` | Équipe responsable | équipe, service, département |
| `thirdParty` | Tiers | partenaire, prestataire, fournisseur |
| `handoff` | Passation | transfert, passage de relais |
| `doing` | Action | ce qu'il fait, activité |
| `frontstageAction` | Action visible | action du personnel visible |
| `backstageAction` | Action en coulisses | action invisible |
| `supportProcess` | Processus de support | processus d'appui |
| `inputRequired` | Informations à fournir | saisie requise, données à fournir |
| `outputProduced` | Résultat produit | livrable |
| `workaround` | Contournement | solution de contournement, astuce, système D |
| `decision` | Décision | choix, point de décision |
| `systems` | Systèmes | systèmes back-end |
| `tools` | Outils | logiciels utilisés |
| `technology` | Technologie | stack technique |
| `dataFlow` | Flux de données | circulation des données |
| `automation` | Automatisation | automatique ou manuel |
| `dependencies` | Dépendances | prérequis |
| `notification` | Notification | alerte, SMS, push |
| `policy` | Règle de gestion | règles, politique, réglementation |
| `frontstage` | Front-office | partie visible, scène |
| `backstage` | Coulisses | arrière-scène |
| `supportProcesses` | Processus de soutien | processus organisationnels |
| `lineOfVisibility` | Ligne de visibilité | frontière du visible |
| `valueExchange` | Échange de valeur | valeur échangée |
| `serviceRecovery` | Rattrapage de service | geste commercial, plan de rattrapage |
| `orchestration` | Orchestration | coordination |
| `kpi` | KPI | indicateur clé de performance, ICP |
| `metric` | Mesure | indicateur, métrique |
| `conversionRate` | Taux de conversion | conversion |
| `cost` | Coût | coût de service |
| `revenueImpact` | Impact sur le chiffre d'affaires | chiffre d'affaires, CA |
| `dropoffRate` | Taux d'abandon | abandon, taux de décrochage |
| `volumePerPeriod` | Volume | volume par période |
| `owner` | Responsable | propriétaire, responsable métier |
| `painPoint` | Point de friction | point de douleur, irritant, problème, friction |
| `opportunity` | Opportunité | piste d'amélioration, amélioration |
| `momentOfTruth` | Moment de vérité | moment clé, moment décisif |
| `insight` | Insight | enseignement, constat |
| `desiredOutcome` | Résultat attendu | résultat souhaité |
| `recommendation` | Recommandation | préconisation |
| `priority` | Priorité | gravité |
| `failureMode` | Mode de défaillance | ce qui peut mal tourner, échec |
| `failureProbability` | Probabilité de défaillance | probabilité |
| `failureImpact` | Impact de la défaillance | conséquence |
| `recoveryPath` | Chemin de reprise | reprise |
| `escalation` | Escalade | remontée |
| `fallback` | Solution de repli | repli |
| `bottleneck` | Goulot d'étranglement | goulot, contrainte de capacité |
| `risk` | Risque | danger |
| `next` | Étape suivante | suivant |
| `previous` | Étape précédente | précédent |
| `branchCondition` | Condition de branchement | embranchement |
| `parallelPath` | Chemin parallèle | en parallèle |
| `entryPoint` | Point d'entrée | entrée |
| `exitPoint` | Point de sortie | sortie |
| `optionality` | Caractère optionnel | obligatoire ou facultatif, facultatif |
| `message` | Message | contenu communiqué |
| `tone` | Ton | ton de voix |
| `contentType` | Type de contenu | format de contenu |
| `cta` | Appel à l'action | bouton |
| `accessibilityBarrier` | Obstacle d'accessibilité | accessibilité, handicap |
| `inclusionConsideration` | Inclusion | qui est exclu |
| `literacyRequirement` | Niveau de littératie requis | littératie numérique, illettrisme |
| `economicBarrier` | Obstacle financier | coût d'accès |
| `culturalConsideration` | Dimension culturelle | normes culturelles |
