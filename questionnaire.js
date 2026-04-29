/*
  Questionnaire content and survey configuration live in this file.
  If you need to customize wording, options, logic, or add more languages later,
  this is the main place to edit.
*/

(function attachSurveyDefinition() {
  const t = (en, fr) => ({ en, fr });

  const SCALE_IMPORTANCE = [
    { value: "1", label: t("Not important at all", "Pas du tout important") },
    { value: "2", label: t("Slightly important", "Légèrement important") },
    { value: "3", label: t("Moderately important", "Modérément important") },
    { value: "4", label: t("Very important", "Très important") },
    { value: "5", label: t("Extremely important", "Extrêmement important") }
  ];

  const SCALE_ABILITY = [
    { value: "1", label: t("Not at all", "Pas du tout") },
    { value: "2", label: t("With difficulty", "Avec difficulté") },
    { value: "3", label: t("Moderately", "Moyennement") },
    { value: "4", label: t("Well", "Bien") },
    { value: "5", label: t("Very well", "Très bien") }
  ];

  const SCALE_CONFIDENCE = [
    { value: "1", label: t("Not at all confident", "Pas du tout confiant(e)") },
    { value: "2", label: t("Slightly confident", "Légèrement confiant(e)") },
    { value: "3", label: t("Moderately confident", "Modérément confiant(e)") },
    { value: "4", label: t("Very confident", "Très confiant(e)") },
    { value: "5", label: t("Extremely confident", "Extrêmement confiant(e)") }
  ];

  const SCALE_FOCUS = [
    { value: "1", label: t("Not at all", "Pas du tout") },
    { value: "2", label: t("A little", "Un peu") },
    { value: "3", label: t("Moderately", "Modérément") },
    { value: "4", label: t("A lot", "Beaucoup") },
    { value: "5", label: t("A great deal", "Énormément") }
  ];

  const SCALE_USEFULNESS = [
    { value: "1", label: t("Not useful at all", "Pas utile du tout") },
    { value: "2", label: t("Slightly useful", "Légèrement utile") },
    { value: "3", label: t("Moderately useful", "Modérément utile") },
    { value: "4", label: t("Very useful", "Très utile") },
    { value: "5", label: t("Extremely useful", "Extrêmement utile") }
  ];

  const SCALE_AGREEMENT = [
    { value: "1", label: t("Strongly disagree", "Pas du tout d'accord") },
    { value: "2", label: t("Disagree", "Pas d'accord") },
    { value: "3", label: t("Neither agree nor disagree", "Ni d'accord ni en désaccord") },
    { value: "4", label: t("Agree", "D'accord") },
    { value: "5", label: t("Strongly agree", "Tout à fait d'accord") }
  ];

  const SCALE_PREPARATION = [
    { value: "1", label: t("Very poorly", "Très mal") },
    { value: "2", label: t("Poorly", "Mal") },
    { value: "3", label: t("Adequately", "Correctement") },
    { value: "4", label: t("Well", "Bien") },
    { value: "5", label: t("Very well", "Très bien") }
  ];

  const definition = {
    config: {
      defaultLanguage: "en",
      endpointUrl: "https://script.google.com/macros/s/AKfycbwncnKwgyE3Mv_orjTpFzEfIT5h2x-3xs5YtI84tBAY75qUA2wEBqCEPz_ZtSiAmSshVQ/exec",
      draftStorageKey: "encg-esp-survey-draft-v1",
      submittedStorageKey: "encg-esp-survey-submitted-v1",
      version: "2026-04-29"
    },
    ui: {
      languageLabel: t("Language", "Langue"),
      academicQuestionnaire: t("Academic questionnaire", "Questionnaire académique"),
      durationLabel: t("Estimated time", "Durée estimée"),
      durationValue: t("About 10 minutes", "Environ 10 minutes"),
      anonymousLabel: t("Responses", "Réponses"),
      anonymousValue: t("Anonymous and academic use only", "Anonymes et réservées à l'usage académique"),
      progressLabel: t("Progress", "Progression"),
      previous: t("Back", "Retour"),
      next: t("OK", "OK"),
      continue: t("Continue", "Continuer"),
      submit: t("Submit responses", "Soumettre les réponses"),
      submitting: t("Submitting", "Envoi"),
      saveNote: t("Your answers are saved automatically on this device until submission.", "Vos réponses sont enregistrées automatiquement sur cet appareil jusqu'à la soumission."),
      requiredError: t("Please answer the required question before continuing.", "Veuillez répondre à la question obligatoire avant de continuer."),
      requiredGroupError: t("Please complete all required items in this section before continuing.", "Veuillez compléter tous les éléments obligatoires de cette section avant de continuer."),
      textareaHint: t("Optional response", "Réponse facultative"),
      selectPlaceholder: t("Type or select an option", "Saisissez ou sélectionnez une option"),
      submissionError: t("The response could not be submitted right now. Please try again in a moment.", "La réponse n'a pas pu être envoyée pour le moment. Veuillez réessayer dans un instant."),
      endpointMissing: t("Add your Google Apps Script web app URL in questionnaire.js before collecting live responses.", "Ajoutez l'URL de votre application Web Google Apps Script dans questionnaire.js avant de collecter de vraies réponses."),
      sectionLabel: t("Section", "Section"),
      alreadySubmittedTitle: t("This device has already submitted this questionnaire.", "Cet appareil a déjà soumis ce questionnaire."),
      alreadySubmittedCopy: t("Duplicate submissions are blocked after a successful send. To test again locally, use the reset instructions in the README.", "Les soumissions en double sont bloquées après un envoi réussi. Pour tester à nouveau en local, utilisez les instructions de réinitialisation dans le README."),
      successTitle: t("Thank you. Your response has been recorded.", "Merci. Votre réponse a bien été enregistrée."),
      successCopy: t("Your anonymous answers will support the analysis of Business English needs at ENCG.", "Vos réponses anonymes contribueront à l'analyse des besoins en anglais des affaires à l'ENCG."),
      successSupport: t("If you need to update your deployment later, replace the Apps Script URL in questionnaire.js and redeploy GitHub Pages if needed.", "Si vous devez mettre à jour le déploiement plus tard, remplacez l'URL Apps Script dans questionnaire.js puis redéployez GitHub Pages si nécessaire."),
      returnTop: t("Back to top", "Retour en haut")
    },
    meta: {
      title: t("A Needs Analysis of Business English ESP at ENCG", "Une analyse des besoins en anglais des affaires à l'ENCG"),
      description: t(
        "This questionnaire is part of a needs analysis of the Business English curriculum at ENCG; your responses will help identify how well the current programme meets students' language learning needs.",
        "Ce questionnaire s'inscrit dans une analyse des besoins du programme d'anglais des affaires à l'ENCG ; vos réponses aideront à déterminer dans quelle mesure le programme actuel répond aux besoins linguistiques des étudiants."
      ),
      contact: "mohamed.bellali@etu.uae.ac.ma"
    },
    sections: {
      consent: { id: "consent", title: t("Consent", "Consentement") },
      A: { id: "A", title: t("Background information", "Informations générales") },
      B: {
        id: "B",
        title: t("Your English language needs", "Vos besoins en langue anglaise"),
        description: t(
          "Please rate how important each activity is to you, both in your current studies and in your future career.",
          "Veuillez évaluer l'importance de chaque activité pour vous, à la fois dans vos études actuelles et dans votre future carrière."
        )
      },
      C: {
        id: "C",
        title: t("Your current English proficiency", "Votre niveau actuel en anglais"),
        description: t(
          "Please assess your current English ability honestly. There are no right or wrong answers.",
          "Veuillez évaluer honnêtement votre niveau actuel en anglais. Il n'y a pas de bonne ou de mauvaise réponse."
        )
      },
      D: {
        id: "D",
        title: t("What you want to focus on", "Ce sur quoi vous souhaitez vous concentrer"),
        description: t(
          "Tell us what you personally want to improve, even if it differs from academic or professional priorities.",
          "Indiquez ce que vous souhaitez personnellement améliorer, même si cela diffère des priorités académiques ou professionnelles."
        )
      },
      E: {
        id: "E",
        title: t("How you learn English", "Comment vous apprenez l'anglais"),
        description: t(
          "This section asks about the learning activities you find useful and how you experience your English classes at ENCG.",
          "Cette section porte sur les activités d'apprentissage que vous trouvez utiles et sur votre expérience des cours d'anglais à l'ENCG."
        )
      },
      F: {
        id: "F",
        title: t("Your English preparation at ENCG", "Votre préparation en anglais à l'ENCG"),
        description: t(
          "Please evaluate how well the English courses at ENCG have prepared you in specific skill areas.",
          "Veuillez évaluer dans quelle mesure les cours d'anglais à l'ENCG vous ont préparé dans des domaines précis."
        )
      },
      G: {
        id: "G",
        title: t("Final reflections", "Réflexions finales"),
        description: t(
          "These final questions are optional and let you add your own perspective.",
          "Ces dernières questions sont facultatives et vous permettent d'ajouter votre propre point de vue."
        )
      },
      honesty: { id: "honesty", title: t("Honesty check", "Vérification de sincérité") }
    },
    steps: [
      {
        id: "consent",
        sectionId: "consent",
        title: t("Consent to participate", "Consentement à participer"),
        description: t(
          "The questionnaire takes approximately 10 minutes. Participation is voluntary, you may withdraw at any time without consequence, and all responses are anonymous and used only for academic purposes.",
          "Le questionnaire prend environ 10 minutes. La participation est volontaire, vous pouvez vous retirer à tout moment sans conséquence, et toutes les réponses sont anonymes et utilisées uniquement à des fins académiques."
        ),
        fields: [
          {
            id: "consent_agree",
            type: "consent",
            required: true,
            copy: t(
              "For questions, please contact: mohamed.bellali@etu.uae.ac.ma",
              "Pour toute question, veuillez contacter : mohamed.bellali@etu.uae.ac.ma"
            ),
            label: t("I have read the above and agree to participate.", "J'ai lu ce qui précède et j'accepte de participer.")
          }
        ]
      },
      {
        id: "A1",
        sectionId: "A",
        title: t("Which ENCG campus do you attend?", "À quel campus de l'ENCG êtes-vous inscrit(e) ?"),
        description: t("Background information", "Informations générales"),
        fields: [{ id: "A1_campus", type: "select", required: true, options: [["agadir", "Agadir"], ["casablanca", "Casablanca"], ["dakhla", "Dakhla"], ["el_jadida", "El Jadida"], ["fes", "Fès"], ["kenitra", "Kenitra"], ["marrakech", "Marrakech"], ["oujda", "Oujda"], ["settat", "Settat"], ["tangier", "Tangier"], ["tetouan", "Tétouan"]].map(([value, label]) => ({ value, label: t(label, label) })) }]
      },
      {
        id: "A2",
        sectionId: "A",
        title: t("What year of study are you in?", "En quelle année d'études êtes-vous ?"),
        fields: [{ id: "A2_year", type: "radio", required: true, options: [{ value: "4th_year", label: t("4th year", "4e année") }, { value: "5th_year", label: t("5th year", "5e année") }] }]
      },
      {
        id: "A3",
        sectionId: "A",
        title: t("What is your pathway?", "Quelle est votre filière ?"),
        fields: [{ id: "A3_pathway", type: "radio", required: true, options: [{ value: "gestion", label: t("Gestion", "Gestion") }, { value: "commerce", label: t("Commerce", "Commerce") }, { value: "not_declared", label: t("Not yet declared", "Pas encore déclarée") }] }]
      },
      {
        id: "A3_1",
        sectionId: "A",
        title: t("What is your specialization?", "Quelle est votre spécialisation ?"),
        description: t("Shown only for students in Gestion.", "Affichée uniquement pour les étudiants en Gestion."),
        visibleWhen: (answers) => answers.A3_pathway === "gestion",
        fields: [{
          id: "A3_1_gestion_specialization",
          type: "select",
          required: true,
          options: [["gestion_financiere_comptable", "Gestion Financière et Comptable"], ["audit_controle_gestion", "Audit et Contrôle de Gestion"], ["grh", "Gestion des Ressources Humaines (GRH)"], ["logistique", "Logistique"], ["not_declared", "Not yet declared"], ["other", "Other"]].map(([value, enLabel]) => ({ value, label: t(enLabel, enLabel === "Not yet declared" ? "Pas encore déclarée" : enLabel === "Other" ? "Autre" : enLabel) }))
        }]
      },
      {
        id: "A3_2",
        sectionId: "A",
        title: t("What is your specialization?", "Quelle est votre spécialisation ?"),
        description: t("Shown only for students in Commerce.", "Affichée uniquement pour les étudiants en Commerce."),
        visibleWhen: (answers) => answers.A3_pathway === "commerce",
        fields: [{
          id: "A3_2_commerce_specialization",
          type: "select",
          required: true,
          options: [["marketing_action_commerciale", "Marketing et Action Commerciale"], ["commerce_international", "Commerce International"], ["publicite_communication", "Publicité et Communication"], ["crm", "Customer Relationship Management (CRM)"], ["not_declared", "Not yet declared"], ["other", "Other"]].map(([value, enLabel]) => ({ value, label: t(enLabel, enLabel === "Not yet declared" ? "Pas encore déclarée" : enLabel === "Other" ? "Autre" : enLabel) }))
        }]
      },
      {
        id: "A4",
        sectionId: "A",
        title: t("Gender", "Genre"),
        fields: [{ id: "A4_gender", type: "radio", required: true, options: [{ value: "female", label: t("Female", "Femme") }, { value: "male", label: t("Male", "Homme") }] }]
      },
      {
        id: "A5",
        sectionId: "A",
        title: t("What is your age?", "Quel est votre âge ?"),
        fields: [{ id: "A5_age", type: "radio", required: true, options: [{ value: "under_20", label: t("Under 20", "Moins de 20 ans") }, { value: "20_22", label: t("20–22", "20–22 ans") }, { value: "23_25", label: t("23–25", "23–25 ans") }, { value: "over_25", label: t("Over 25", "Plus de 25 ans") }] }]
      },
      {
        id: "A6",
        sectionId: "A",
        title: t("How would you rate your overall level of English?", "Comment évalueriez-vous votre niveau général d'anglais ?"),
        fields: [{
          id: "A6_english_level",
          type: "radio",
          required: true,
          options: [
            { value: "a1_a2", label: t("A1–A2 — Beginner / Elementary (I can understand and use basic everyday expressions)", "A1–A2 — Débutant / Élémentaire (je peux comprendre et utiliser des expressions simples de la vie quotidienne)") },
            { value: "b1", label: t("B1 — Intermediate (I can deal with most situations likely to arise while travelling or at work)", "B1 — Intermédiaire (je peux faire face à la plupart des situations susceptibles de se présenter en voyage ou au travail)") },
            { value: "b2", label: t("B2 — Upper-intermediate (I can interact with fluency and spontaneity with native speakers)", "B2 — Intermédiaire supérieur (je peux interagir avec aisance et spontanéité avec des locuteurs natifs)") },
            { value: "c1_c2", label: t("C1–C2 — Advanced / Mastery (I can use English flexibly and effectively for academic and professional purposes)", "C1–C2 — Avancé / Maîtrise (je peux utiliser l'anglais avec souplesse et efficacité à des fins académiques et professionnelles)") }
          ]
        }]
      },
      {
        id: "A7",
        sectionId: "A",
        title: t("What is the status of your final-year project (PFE)?", "Quel est l'état d'avancement de votre projet de fin d'études (PFE) ?"),
        fields: [{ id: "A7_pfe_status", type: "radio", required: true, options: [{ value: "not_started", label: t("Not yet started", "Pas encore commencé") }, { value: "in_progress", label: t("Currently doing it", "En cours") }, { value: "completed", label: t("Completed", "Terminé") }] }]
      },
      {
        id: "A8",
        sectionId: "A",
        title: t("What is the status of your internship?", "Quel est l'état d'avancement de votre stage ?"),
        fields: [{ id: "A8_internship_status", type: "radio", required: true, options: [{ value: "not_started", label: t("Not yet started", "Pas encore commencé") }, { value: "in_progress", label: t("In progress", "En cours") }, { value: "completed", label: t("Completed", "Terminé") }] }]
      },
      {
        id: "A9",
        sectionId: "A",
        title: t("During your internship, how often did you use English?", "Pendant votre stage, à quelle fréquence avez-vous utilisé l'anglais ?"),
        visibleWhen: (answers) => ["in_progress", "completed"].includes(answers.A8_internship_status),
        fields: [{ id: "A9_internship_english_frequency", type: "radio", required: true, options: [{ value: "never", label: t("Never", "Jamais") }, { value: "rarely", label: t("Rarely", "Rarement") }, { value: "sometimes", label: t("Sometimes", "Parfois") }, { value: "often", label: t("Often", "Souvent") }, { value: "always", label: t("Always", "Toujours") }] }]
      },
      {
        id: "B1",
        sectionId: "B",
        title: t("In your current studies", "Dans vos études actuelles"),
        description: t("Rate how important each activity is to you in your current studies.", "Évaluez l'importance de chaque activité pour vous dans vos études actuelles."),
        fields: [{ id: "B1_group", type: "scaleGroup", required: true, scale: SCALE_IMPORTANCE, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "B1_1", prompt: t("Understanding lectures and videos in English", "Comprendre des cours et des vidéos en anglais") }, { id: "B1_2", prompt: t("Reading textbooks, case studies, and articles in English (including online sources)", "Lire des manuels, des études de cas et des articles en anglais, y compris des sources en ligne") }, { id: "B1_3", prompt: t("Participating in class discussions and group work in English", "Participer à des discussions de classe et à des travaux de groupe en anglais") }, { id: "B1_4", prompt: t("Giving academic presentations in English", "Faire des présentations académiques en anglais") }, { id: "B1_5", prompt: t("Writing academic reports and assignments in English", "Rédiger des rapports et des travaux académiques en anglais") }] }]
      },
      {
        id: "B2",
        sectionId: "B",
        title: t("In your future career", "Dans votre future carrière"),
        description: t("Rate how important each activity is to you in your future career.", "Évaluez l'importance de chaque activité pour vous dans votre future carrière."),
        fields: [{ id: "B2_group", type: "scaleGroup", required: true, scale: SCALE_IMPORTANCE, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "B2_1", prompt: t("Understanding spoken English in professional settings (meetings, phone calls, video conferences)", "Comprendre l'anglais oral dans des contextes professionnels (réunions, appels téléphoniques, visioconférences)") }, { id: "B2_2", prompt: t("Reading professional documents in English (reports, contracts, emails, technical documents)", "Lire des documents professionnels en anglais (rapports, contrats, courriels, documents techniques)") }, { id: "B2_3", prompt: t("Speaking English in professional interactions (with colleagues, clients, or partners)", "Parler anglais lors d'interactions professionnelles (avec des collègues, des clients ou des partenaires)") }, { id: "B2_4", prompt: t("Giving professional presentations in English (to clients, teams, or management)", "Faire des présentations professionnelles en anglais (à des clients, des équipes ou à la direction)") }, { id: "B2_5", prompt: t("Writing professional emails and business correspondence in English", "Rédiger des courriels professionnels et des correspondances d'affaires en anglais") }, { id: "B2_6", prompt: t("Writing long professional documents in English (reports, proposals, formal documents)", "Rédiger de longs documents professionnels en anglais (rapports, propositions, documents formels)") }] }]
      },
      {
        id: "C1",
        sectionId: "C",
        title: t("General English ability", "Compétence générale en anglais"),
        description: t("Please rate how well you can currently perform each skill.", "Veuillez évaluer dans quelle mesure vous pouvez actuellement réaliser chaque compétence."),
        fields: [{ id: "C1_group", type: "scaleGroup", required: true, scale: SCALE_ABILITY, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "C1_1", prompt: t("Listening", "Compréhension orale"), detail: t("Understand spoken English (conversations, lectures, media)", "Comprendre l'anglais parlé (conversations, cours, médias)") }, { id: "C1_2", prompt: t("Reading", "Lecture"), detail: t("Read texts in English (articles, books, documents)", "Lire des textes en anglais (articles, livres, documents)") }, { id: "C1_3", prompt: t("Spoken interaction", "Interaction orale"), detail: t("Take part in conversations in English", "Participer à des conversations en anglais") }, { id: "C1_4", prompt: t("Spoken production", "Production orale"), detail: t("Speak English in extended discourse (presentations, explanations)", "Parler anglais de manière développée (présentations, explications)") }, { id: "C1_5", prompt: t("Writing", "Écriture"), detail: t("Write texts in English (emails, reports, essays)", "Rédiger des textes en anglais (courriels, rapports, essais)") }] }]
      },
      {
        id: "C2",
        sectionId: "C",
        title: t("Confidence in professional Business English tasks", "Confiance dans les tâches professionnelles en anglais des affaires"),
        fields: [{ id: "C2_group", type: "scaleGroup", required: true, scale: SCALE_CONFIDENCE, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "C2_1", prompt: t("Understanding spoken English in professional settings (meetings, phone calls, video conferences)", "Comprendre l'anglais oral dans des contextes professionnels (réunions, appels téléphoniques, visioconférences)") }, { id: "C2_2", prompt: t("Reading professional documents in English (reports, contracts, emails, technical documents)", "Lire des documents professionnels en anglais (rapports, contrats, courriels, documents techniques)") }, { id: "C2_3", prompt: t("Speaking English in professional interactions (with colleagues, clients, or partners)", "Parler anglais lors d'interactions professionnelles (avec des collègues, des clients ou des partenaires)") }, { id: "C2_4", prompt: t("Giving professional presentations in English (to clients, teams, or management)", "Faire des présentations professionnelles en anglais (à des clients, des équipes ou à la direction)") }, { id: "C2_5", prompt: t("Writing professional emails and business correspondence in English", "Rédiger des courriels professionnels et des correspondances d'affaires en anglais") }, { id: "C2_6", prompt: t("Writing long professional documents in English (reports, proposals, formal documents)", "Rédiger de longs documents professionnels en anglais (rapports, propositions, documents formels)") }] }]
      },
      {
        id: "D",
        sectionId: "D",
        title: t("What do you personally want to improve?", "Que souhaitez-vous personnellement améliorer ?"),
        fields: [{ id: "D_group", type: "scaleGroup", required: true, scale: SCALE_FOCUS, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "D1", prompt: t("Improving my listening skills in English", "Améliorer mes compétences de compréhension orale en anglais") }, { id: "D2", prompt: t("Improving my reading skills in English", "Améliorer mes compétences de lecture en anglais") }, { id: "D3", prompt: t("Improving my speaking skills in English", "Améliorer mes compétences d'expression orale en anglais") }, { id: "D4", prompt: t("Improving my writing skills in English", "Améliorer mes compétences d'expression écrite en anglais") }, { id: "D5", prompt: t("Improving my Business English vocabulary and terminology", "Améliorer mon vocabulaire et ma terminologie en anglais des affaires") }, { id: "D6", prompt: t("Improving my grammar and accuracy in English", "Améliorer ma grammaire et ma précision en anglais") }] }]
      },
      {
        id: "E1",
        sectionId: "E",
        title: t("Activities you find useful", "Activités que vous trouvez utiles"),
        fields: [{ id: "E1_group", type: "scaleGroup", required: true, scale: SCALE_USEFULNESS, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "E1_1", prompt: t("Role-plays and simulations of real-world business situations", "Jeux de rôle et simulations de situations réelles du monde des affaires") }, { id: "E1_2", prompt: t("Group discussions and collaborative activities in English", "Discussions de groupe et activités collaboratives en anglais") }, { id: "E1_3", prompt: t("Case studies, business analyses, and project-based work", "Études de cas, analyses commerciales et travaux basés sur des projets") }, { id: "E1_4", prompt: t("Grammar and vocabulary exercises", "Exercices de grammaire et de vocabulaire") }] }]
      },
      {
        id: "E2",
        sectionId: "E",
        title: t("Your current English classes", "Vos cours d'anglais actuels"),
        fields: [{ id: "E2_group", type: "scaleGroup", required: true, scale: SCALE_AGREEMENT, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "E2_1", prompt: t("My English classes give me enough opportunities to practice speaking", "Mes cours d'anglais me donnent suffisamment d'occasions de pratiquer l'expression orale") }, { id: "E2_2", prompt: t("The materials and topics used in class are relevant to my future career", "Les supports et les thèmes utilisés en classe sont pertinents pour ma future carrière") }, { id: "E2_3", prompt: t("My English classes focus more on grammar than on real communication", "Mes cours d'anglais se concentrent davantage sur la grammaire que sur la communication réelle") }, { id: "E2_4", prompt: t("The teaching methods used in my English classes match how I prefer to learn", "Les méthodes d'enseignement utilisées dans mes cours d'anglais correspondent à ma manière préférée d'apprendre") }] }]
      },
      {
        id: "F",
        sectionId: "F",
        title: t("How well have ENCG English courses prepared you?", "Dans quelle mesure les cours d'anglais de l'ENCG vous ont-ils préparé(e) ?"),
        fields: [{ id: "F_group", type: "scaleGroup", required: true, scale: SCALE_PREPARATION, legendTitle: t("Shared answer scale", "Échelle de réponse commune"), items: [{ id: "F1", prompt: t("Listening", "Compréhension orale"), detail: t("Listening and understanding spoken English in academic and professional contexts", "Écouter et comprendre l'anglais parlé dans des contextes académiques et professionnels") }, { id: "F2", prompt: t("Reading", "Lecture"), detail: t("Reading academic and professional texts in English", "Lire des textes académiques et professionnels en anglais") }, { id: "F3", prompt: t("Speaking", "Expression orale"), detail: t("Speaking English (presentations, discussions, professional interactions)", "Parler anglais (présentations, discussions, interactions professionnelles)") }, { id: "F4", prompt: t("Writing", "Écriture"), detail: t("Writing in English (emails, reports, academic and professional documents)", "Écrire en anglais (courriels, rapports, documents académiques et professionnels)") }, { id: "F5", prompt: t("Vocabulary and terminology", "Vocabulaire et terminologie"), detail: t("Mastering Business English vocabulary and terminology specific to your specialization", "Maîtriser le vocabulaire et la terminologie de l'anglais des affaires propres à votre spécialisation") }] }]
      },
      { id: "G1", sectionId: "G", title: t("What is one thing you wish your English courses at ENCG focused more on?", "Quelle est la principale chose sur laquelle vous souhaiteriez que vos cours d'anglais à l'ENCG se concentrent davantage ?"), fields: [{ id: "G1", type: "textarea", required: false, maxLength: 600 }] },
      { id: "G2", sectionId: "G", title: t("What is one thing you think your English courses at ENCG do well?", "Quelle est la principale chose que vos cours d'anglais à l'ENCG font bien selon vous ?"), fields: [{ id: "G2", type: "textarea", required: false, maxLength: 600 }] },
      { id: "G3", sectionId: "G", title: t("Any other comments about your Business English learning experience at ENCG?", "Avez-vous d'autres commentaires sur votre expérience d'apprentissage de l'anglais des affaires à l'ENCG ?"), fields: [{ id: "G3", type: "textarea", required: false, maxLength: 800 }] },
      {
        id: "honesty",
        sectionId: "honesty",
        title: t("In your honest opinion, should we use your responses in our analysis?", "Selon vous, devrions-nous utiliser vos réponses dans notre analyse ?"),
        description: t("Thank you for completing this questionnaire. This final question helps ensure the quality of the analysis.", "Merci d'avoir rempli ce questionnaire. Cette dernière question nous aide à garantir la qualité de l'analyse."),
        fields: [{ id: "honesty_check", type: "radio", required: true, options: [{ value: "yes_use", label: t("Yes, please use my responses", "Oui, veuillez utiliser mes réponses") }, { value: "no_do_not_use", label: t("No, please do not use my responses", "Non, veuillez ne pas utiliser mes réponses") }] }]
      }
    ]
  };

  window.SURVEY_DEFINITION = definition;
})();
