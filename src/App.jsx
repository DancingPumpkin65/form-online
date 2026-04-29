import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const INTRO_SECTION_IDS = new Set(["A", "B", "C", "D", "E", "F", "G"]);
const TRANSITION_MS = 420;

export default function App() {
  const survey = window.SURVEY_DEFINITION;

  if (!survey) {
    return <main className="page-shell">Survey definition not found.</main>;
  }

  const draftKey = survey.config.draftStorageKey;
  const submittedKey = survey.config.submittedStorageKey;
  const isLocalPreview = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);

  if (window.location.search.includes("reset=1")) {
    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(submittedKey);
  }

  const initialState = getInitialState(survey, draftKey, submittedKey);

  const [language, setLanguage] = useState(initialState.language);
  const [answers, setAnswers] = useState(initialState.answers);
  const [errors, setErrors] = useState({});
  const [displayItemId, setDisplayItemId] = useState(initialState.displayItemId);
  const [submissionId, setSubmissionId] = useState(initialState.submissionId);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(initialState.submittedRecord);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [transition, setTransition] = useState(null);
  const [transitionHeight, setTransitionHeight] = useState(null);

  const formRef = useRef(null);
  const fromScreenRef = useRef(null);
  const toScreenRef = useRef(null);

  const visibleSteps = useMemo(() => getVisibleSteps(survey.steps, answers), [survey.steps, answers]);
  const flowItems = useMemo(() => buildFlowItems(visibleSteps), [visibleSteps]);

  useEffect(() => {
    if (submittedRecord) {
      return;
    }

    if (!flowItems.some((item) => item.id === displayItemId)) {
      setDisplayItemId(findFirstIncompleteItemId(flowItems, answers, survey) || flowItems[0]?.id || displayItemId);
    }
  }, [answers, displayItemId, flowItems, submittedRecord, survey]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (submittedRecord) {
      return;
    }

    window.localStorage.setItem(
      draftKey,
      JSON.stringify({
        language,
        answers,
        currentItemId: displayItemId,
        submissionId
      })
    );
  }, [answers, displayItemId, draftKey, language, submissionId, submittedRecord]);

  useEffect(() => {
    if (transition || submittedRecord) {
      return;
    }

    const target = formRef.current?.querySelector("input, select, textarea, button[type='submit']");
    target?.focus({ preventScroll: true });
  }, [displayItemId, submittedRecord, transition]);

  useEffect(() => {
    const onKeyDown = async (event) => {
      if (transition || submitting || submittedRecord) {
        return;
      }

      const activeElement = document.activeElement;
      const isTextarea = activeElement?.tagName === "TEXTAREA";
      const isSelect = activeElement?.tagName === "SELECT";

      if (event.key !== "Enter" || event.shiftKey || isTextarea || isSelect) {
        return;
      }

      event.preventDefault();

      const currentItem = getCurrentFlowItem(flowItems, displayItemId);

      if (!currentItem) {
        return;
      }

      if (currentItem.type === "intro") {
        await moveFlowItem(1);
        return;
      }

      if (currentItem.id === flowItems[flowItems.length - 1]?.id) {
        await handleSubmit();
        return;
      }

      await advanceFlow();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [displayItemId, flowItems, submittedRecord, submitting, transition, answers, language]);

  useLayoutEffect(() => {
    if (!transition) {
      setTransitionHeight(null);
      return;
    }

    const fromHeight = fromScreenRef.current?.offsetHeight || 0;
    const toHeight = toScreenRef.current?.offsetHeight || 0;
    setTransitionHeight(Math.max(fromHeight, toHeight, 240));
  }, [transition]);

  const activeView = buildView({
    survey,
    flowItems,
    displayItemId,
    language,
    answers,
    errors,
    submitting,
    submittedRecord,
    justSubmitted
  });

  const progressPercent = submittedRecord ? 100 : activeView.progressPercent;
  const progressLabel = submittedRecord ? "" : activeView.progressLabel;
  const progressCount = submittedRecord ? "" : activeView.progressCount;

  const transitionFromView = transition
    ? buildView({
        survey,
        flowItems,
        displayItemId: transition.fromId,
        language,
        answers,
        errors,
        submitting,
        submittedRecord,
        justSubmitted
      })
    : null;

  const transitionToView = transition
    ? buildView({
        survey,
        flowItems,
        displayItemId: transition.toId,
        language,
        answers,
        errors,
        submitting,
        submittedRecord,
        justSubmitted
      })
    : null;

  async function moveFlowItem(direction) {
    if (transition) {
      return;
    }

    const currentIndex = flowItems.findIndex((item) => item.id === displayItemId);
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= flowItems.length) {
      return;
    }

    const nextItemId = flowItems[nextIndex].id;
    setErrors({});
    setAlertMessage("");
    await transitionTo(nextItemId, direction > 0 ? "forward" : "backward");
  }

  async function advanceFlow() {
    if (transition) {
      return;
    }

    const currentItem = getCurrentFlowItem(flowItems, displayItemId);

    if (!currentItem) {
      return;
    }

    if (currentItem.type === "intro") {
      await moveFlowItem(1);
      return;
    }

    const nextErrors = validateStep(currentItem.step, answers, survey, language);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (currentItem.id === flowItems[flowItems.length - 1]?.id) {
      return;
    }

    await moveFlowItem(1);
  }

  async function transitionTo(nextItemId, direction) {
    if (prefersReducedMotion()) {
      setDisplayItemId(nextItemId);
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    setTransition({ fromId: displayItemId, toId: nextItemId, direction });
    await delay(TRANSITION_MS);
    setDisplayItemId(nextItemId);
    setTransition(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onFieldChange(name, value) {
    setAnswers((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
    setAlertMessage("");
  }

  function focusFirstError(nextErrors) {
    const fieldName = Object.keys(nextErrors)[0];
    const input = formRef.current?.querySelector(`[name="${fieldName}"]`);
    input?.focus({ preventScroll: false });
  }

  async function handleSubmit(event) {
    event?.preventDefault();

    if (transition || submitting || submittedRecord) {
      return;
    }

    const allErrors = {};
    visibleSteps.forEach((step) => Object.assign(allErrors, validateStep(step, answers, survey, language)));
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const firstBadItemId = findFirstIncompleteItemId(flowItems, answers, survey, language);

      if (firstBadItemId && firstBadItemId !== displayItemId) {
        await transitionTo(firstBadItemId, "forward");
      }

      focusFirstError(allErrors);
      return;
    }

    const endpointUrl = survey.config.endpointUrl;

    if (!endpointUrl || endpointUrl.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      if (!isLocalPreview) {
        setAlertMessage(getText(survey.ui.endpointMissing, language));
        return;
      }
    }

    setSubmitting(true);
    setAlertMessage("");

    try {
      const result = await sendSubmission(endpointUrl, createSubmissionPayload(survey, visibleSteps, answers, language, submissionId));

      if (!result.success) {
        throw new Error(result.message || getText(survey.ui.submissionError, language));
      }

      const nextRecord = {
        submissionId,
        timestamp: result.timestamp || new Date().toISOString()
      };

      window.localStorage.setItem(submittedKey, JSON.stringify(nextRecord));
      window.localStorage.removeItem(draftKey);
      setSubmittedRecord(nextRecord);
      setJustSubmitted(true);
      setErrors({});
    } catch (error) {
      setAlertMessage(error.message || getText(survey.ui.submissionError, language));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="top-progress" aria-hidden="true">
        <div className="top-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <header className="topbar">
        <div className="topbar-meta">
          <p className="brand-copy">{getText(survey.meta.title, language)}</p>
          <div className="progress-summary">
            <span className="progress-label">{progressLabel}</span>
            <span className="progress-count">{progressCount}</span>
          </div>
        </div>

        <label className="language-switcher" htmlFor="language-select">
          <span>{getText(survey.ui.languageLabel, language)}</span>
          <select
            id="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </header>

      <main className="survey-layout">
        <section className="survey-stage">
          <div id="alert-host" aria-live="polite">
            {alertMessage ? <div className="alert">{alertMessage}</div> : null}
          </div>

          <form
            ref={formRef}
            className={`survey-card${transition ? " is-transitioning" : ""}`}
            onSubmit={handleSubmit}
            style={transitionHeight ? { height: `${transitionHeight}px` } : undefined}
            noValidate
          >
            {transition ? (
              <>
                <div
                  ref={fromScreenRef}
                  className={`flow-screen flow-screen-live ${
                    transition.direction === "backward" ? "flow-screen-exit-backward" : "flow-screen-exit-forward"
                  }`}
                >
                  {renderView(transitionFromView, {
                    language,
                    answers,
                    errors,
                    submitting,
                    survey,
                    onFieldChange,
                    onNavigateBack: () => moveFlowItem(-1),
                    onNavigateNext: () => advanceFlow(),
                    onRestart: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    onSubmit: handleSubmit
                  })}
                </div>

                <div
                  ref={toScreenRef}
                  className={`flow-screen flow-screen-next ${
                    transition.direction === "backward" ? "flow-screen-enter-backward" : "flow-screen-enter-forward"
                  }`}
                >
                  {renderView(transitionToView, {
                    language,
                    answers,
                    errors,
                    submitting,
                    survey,
                    onFieldChange,
                    onNavigateBack: () => moveFlowItem(-1),
                    onNavigateNext: () => advanceFlow(),
                    onRestart: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    onSubmit: handleSubmit
                  })}
                </div>
              </>
            ) : (
              <div className="flow-screen flow-screen-live">
                {renderView(activeView, {
                  language,
                  answers,
                  errors,
                  submitting,
                  survey,
                  onFieldChange,
                  onNavigateBack: () => moveFlowItem(-1),
                  onNavigateNext: () => advanceFlow(),
                  onRestart: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  onSubmit: handleSubmit
                })}
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}

function renderView(view, props) {
  if (!view) {
    return null;
  }

  if (view.type === "success") {
    return (
      <section className="success-state">
        <div className="success-panel">
          <div className="success-badge" aria-hidden="true" />
          <h2 className="success-title">{view.title}</h2>
          <p className="success-copy">{view.copy}</p>
          <p className="support-note">{view.support}</p>
          <div className="success-actions">
            <button type="button" className="button button-secondary" onClick={props.onRestart}>
              {getText(props.survey.ui.returnTop, props.language)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (view.type === "intro") {
    return (
      <section className="section-intro-shell step-shell forward">
        <div className="section-intro-panel">
          <p className="section-intro-kicker">"</p>
          <h2 className="section-intro-title">{view.title}</h2>
          {view.copy ? <p className="section-intro-copy">{view.copy}</p> : null}
          <div className="section-intro-actions">
            {view.canGoBack ? (
              <button type="button" className="button button-secondary" onClick={props.onNavigateBack}>
                {getText(props.survey.ui.previous, props.language)}
              </button>
            ) : null}
            <button type="button" className="button button-primary" onClick={props.onNavigateNext}>
              {getText(props.survey.ui.continue, props.language)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className={`step-shell ${view.motion}`}>
      <div className="step-main">
        <div className="step-header">
          <div className="step-headline">
            <span className="question-badge">{view.questionNumber}</span>
            <h2 className="question-title">
              {view.title}
              {view.required ? <span className="required-mark">*</span> : null}
            </h2>
          </div>
          {view.description ? <p className="step-description">{view.description}</p> : null}
        </div>

        <div className="field-stack">
          {view.step.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              step={view.step}
              language={props.language}
              answers={props.answers}
              errors={props.errors}
              survey={props.survey}
              onFieldChange={props.onFieldChange}
            />
          ))}
        </div>
      </div>

      <div className="nav-row">
        <div className="button-group">
          {view.canGoBack ? (
            <button type="button" className="button button-secondary" onClick={props.onNavigateBack}>
              {getText(props.survey.ui.previous, props.language)}
            </button>
          ) : null}
          <button
            type={view.isLast ? "submit" : "button"}
            className="button button-primary"
            onClick={view.isLast ? undefined : props.onNavigateNext}
            disabled={props.submitting}
          >
            {props.submitting ? (
              <>
                <span className="loader" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>{getText(props.survey.ui.submitting, props.language)}</span>
              </>
            ) : view.isLast ? (
              getText(props.survey.ui.submit, props.language)
            ) : (
              getText(props.survey.ui.next, props.language)
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer({ field, step, language, answers, errors, survey, onFieldChange }) {
  const stepTitle = buildQuestionTitle(step, survey, language);
  const hasError = Boolean(errors[field.id]);

  if (field.type === "consent") {
    return (
      <div className={`field-card compact${hasError ? " error-field" : ""}`}>
        <label className="consent-toggle">
          <input
            type="checkbox"
            name={field.id}
            checked={answers[field.id] === "yes"}
            onChange={(event) => onFieldChange(field.id, event.target.checked ? "yes" : "")}
          />
          <span className="consent-toggle-label">
            <span className="consent-box" aria-hidden="true" />
            <span className="consent-label-copy">{getText(field.label, language)}</span>
          </span>
        </label>
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={`field-card${hasError ? " error-field" : ""}`}>
        <select
          className="select-input"
          name={field.id}
          aria-label={stepTitle}
          required
          value={answers[field.id] || ""}
          onChange={(event) => onFieldChange(field.id, event.target.value)}
        >
          <option value="" disabled hidden>
            {getText(survey.ui.selectPlaceholder, language)}
          </option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {getText(option.label, language)}
            </option>
          ))}
        </select>
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
      </div>
    );
  }

  if (field.type === "radio") {
    const longOptions = field.options.some((option) => getText(option.label, language).length > 48);

    return (
      <div className={`field-card${hasError ? " error-field" : ""}`}>
        <div
          className={`choice-grid${longOptions ? " long-options" : ""}`}
          data-count={field.options.length}
          role="radiogroup"
          aria-label={stepTitle}
        >
          {field.options.map((option, index) => (
            <label key={option.value} className="choice-option">
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={answers[field.id] === option.value}
                onChange={(event) => onFieldChange(field.id, event.target.value)}
              />
              <span className="choice-label">
                <span className="option-chip">{String.fromCharCode(65 + index)}</span>
                <span className="choice-copy">{getText(option.label, language)}</span>
              </span>
            </label>
          ))}
        </div>
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={`field-card${hasError ? " error-field" : ""}`}>
        <p className="field-hint">{getText(survey.ui.textareaHint, language)}</p>
        <textarea
          className="textarea-input"
          name={field.id}
          maxLength={field.maxLength || 1200}
          aria-label={stepTitle}
          value={answers[field.id] || ""}
          onChange={(event) => onFieldChange(field.id, event.target.value)}
        />
        <span className="textarea-counter">
          {String(answers[field.id] || "").length} / {field.maxLength || 1200}
        </span>
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
      </div>
    );
  }

  if (field.type === "scaleGroup") {
    const hasScaleError = field.items.some((item) => errors[item.id]);

    return (
      <div className={`field-card scale-group${hasScaleError ? " error-field" : ""}`}>
        <div className="legend-card">
          <div className="legend-list">
            {field.scale.map((option) => (
              <span key={option.value}>
                {option.value} — {getText(option.label, language)}
              </span>
            ))}
          </div>
        </div>

        <div className="scale-head" aria-hidden="true">
          <span>&nbsp;</span>
          {field.scale.map((option) => (
            <span key={option.value}>{option.value}</span>
          ))}
        </div>

        <div className="scale-items">
          {field.items.map((item) => (
            <div key={item.id}>
              <div className="scale-row">
                <p className="scale-prompt">
                  {getText(item.prompt, language)}
                  {item.detail ? <small>{getText(item.detail, language)}</small> : null}
                </p>

                {field.scale.map((option) => (
                  <label key={option.value} className="scale-option">
                    <input
                      type="radio"
                      name={item.id}
                      value={option.value}
                      checked={answers[item.id] === option.value}
                      onChange={(event) => onFieldChange(item.id, event.target.value)}
                    />
                    <span className="scale-circle" aria-label={getText(option.label, language)} />
                  </label>
                ))}
              </div>
              {errors[item.id] ? <p className="error-text">{errors[item.id]}</p> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function getInitialState(survey, draftKey, submittedKey) {
  const submittedRecord = safelyParse(window.localStorage.getItem(submittedKey));
  const draft = safelyParse(window.localStorage.getItem(draftKey));

  return {
    language: draft?.language || survey.config.defaultLanguage,
    answers: draft?.answers || {},
    displayItemId: normalizeSavedItemId(draft?.currentItemId || draft?.currentStepId || `step:${survey.steps[0].id}`),
    submissionId: draft?.submissionId || createSubmissionId(),
    submittedRecord: submittedRecord || null
  };
}

function getVisibleSteps(steps, answers) {
  return steps.filter((step) => (typeof step.visibleWhen === "function" ? step.visibleWhen(answers) : true));
}

function buildFlowItems(visibleSteps) {
  const items = [];
  let previousSectionId = null;
  let questionNumber = 0;

  visibleSteps.forEach((step) => {
    if (INTRO_SECTION_IDS.has(step.sectionId) && previousSectionId !== step.sectionId) {
      items.push({ id: `intro:${step.sectionId}`, type: "intro", sectionId: step.sectionId });
    }

    questionNumber += 1;
    items.push({ id: `step:${step.id}`, type: "step", step, questionNumber });
    previousSectionId = step.sectionId;
  });

  return items;
}

function getCurrentFlowItem(flowItems, itemId) {
  return flowItems.find((item) => item.id === itemId) || flowItems[0];
}

function findFirstIncompleteItemId(flowItems, answers, survey, language = survey.config.defaultLanguage) {
  const firstBad = flowItems.find(
    (item) => item.type === "step" && Object.keys(validateStep(item.step, answers, survey, language)).length > 0
  );

  return firstBad ? firstBad.id : null;
}

function validateStep(step, answers, survey, language) {
  const errors = {};

  step.fields.forEach((field) => {
    if (field.type === "scaleGroup") {
      field.items.forEach((item) => {
        if (field.required && !answers[item.id]) {
          errors[item.id] = getText(survey.ui.requiredGroupError, language);
        }
      });
      return;
    }

    if (field.type === "consent") {
      if (field.required && answers[field.id] !== "yes") {
        errors[field.id] = getText(survey.ui.requiredError, language);
      }
      return;
    }

    if (field.required && !String(answers[field.id] || "").trim()) {
      errors[field.id] = getText(survey.ui.requiredError, language);
    }
  });

  return errors;
}

function buildView({ survey, flowItems, displayItemId, language, answers, errors, submitting, submittedRecord, justSubmitted }) {
  if (submittedRecord) {
    return {
      type: "success",
      title: justSubmitted ? getText(survey.ui.successTitle, language) : getText(survey.ui.alreadySubmittedTitle, language),
      copy: justSubmitted ? getText(survey.ui.successCopy, language) : getText(survey.ui.alreadySubmittedCopy, language),
      support: getText(survey.ui.successSupport, language),
      progressLabel: "",
      progressCount: "",
      progressPercent: 100
    };
  }

  const currentItem = getCurrentFlowItem(flowItems, displayItemId);
  const totalQuestions = flowItems.filter((item) => item.type === "step").length;
  const currentQuestionNumber = currentItem.type === "step"
    ? currentItem.questionNumber
    : Math.max(0, getNextQuestionNumber(flowItems, currentItem.id) - 1);
  const progressPercent = totalQuestions === 0 ? 0 : (Math.max(1, currentQuestionNumber) / totalQuestions) * 100;

  if (currentItem.type === "intro") {
    const section = survey.sections[currentItem.sectionId];
    const currentIndex = flowItems.findIndex((item) => item.id === currentItem.id);

    return {
      type: "intro",
      title: `Section ${section.id} — ${getText(section.title, language)}`,
      copy: getText(section.description || "", language),
      canGoBack: currentIndex > 0,
      progressLabel: getText(survey.ui.progressLabel, language),
      progressCount: `${currentQuestionNumber || 1} / ${totalQuestions}`,
      progressPercent
    };
  }

  const currentIndex = flowItems.findIndex((item) => item.id === currentItem.id);

  return {
    type: "step",
    step: currentItem.step,
    motion: "forward",
    questionNumber: currentItem.questionNumber,
    title: buildQuestionTitle(currentItem.step, survey, language),
    description: getQuestionDescription(currentItem.step, survey, language),
    required: stepHasRequiredField(currentItem.step),
    canGoBack: currentIndex > 0,
    isLast: currentItem.id === flowItems[flowItems.length - 1]?.id,
    progressLabel: formatStepCode(currentItem.step.id),
    progressCount: `${currentQuestionNumber || 1} / ${totalQuestions}`,
    progressPercent
  };
}

function getQuestionDescription(step, survey, language) {
  if (step.id === "consent") {
    return getText(survey.meta.description, language);
  }

  const description = getText(step.description || "", language);
  const sectionTitle = getText(survey.sections[step.sectionId]?.title || "", language);

  if (!description || description === sectionTitle) {
    return "";
  }

  return description;
}

function buildQuestionTitle(step, survey, language) {
  if (step.id === "consent") {
    return getText(survey.meta.title, language);
  }

  if (step.id === "honesty") {
    return getText(step.title, language);
  }

  return `${formatStepCode(step.id)}: ${getText(step.title, language)}`;
}

function stepHasRequiredField(step) {
  return step.fields.some((field) => field.required);
}

function getNextQuestionNumber(flowItems, currentItemId) {
  const currentIndex = flowItems.findIndex((item) => item.id === currentItemId);
  const nextStep = flowItems.slice(currentIndex + 1).find((item) => item.type === "step");
  return nextStep ? nextStep.questionNumber : flowItems.filter((item) => item.type === "step").length;
}

function getFieldIds(step) {
  return step.fields.flatMap((field) => (field.type === "scaleGroup" ? field.items.map((item) => item.id) : [field.id]));
}

function createSubmissionPayload(survey, visibleSteps, answers, language, submissionId) {
  const visibleFieldIds = new Set(visibleSteps.flatMap((step) => getFieldIds(step)));
  const allFieldIds = survey.steps.flatMap((step) => getFieldIds(step));
  const responses = {};

  allFieldIds.forEach((fieldId) => {
    responses[fieldId] = visibleFieldIds.has(fieldId) ? answers[fieldId] || "" : "";
  });

  return {
    surveyId: "encg-business-english-needs-analysis",
    surveyVersion: survey.config.version,
    submissionId,
    language,
    submittedAtClient: new Date().toISOString(),
    columnOrder: allFieldIds,
    responses
  };
}

async function sendSubmission(endpointUrl, payload) {
  if (!endpointUrl || endpointUrl.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    await delay(900);
    return { success: true, timestamp: new Date().toISOString(), mock: true };
  }

  const useNoCors = isGoogleAppsScriptEndpoint(endpointUrl);
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
    mode: useNoCors ? "no-cors" : "cors"
  });

  if (useNoCors) {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      opaque: true
    };
  }

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { success: response.ok, message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Submission failed.");
  }

  return data;
}

function isGoogleAppsScriptEndpoint(endpointUrl) {
  try {
    const url = new URL(endpointUrl);
    return url.hostname === "script.google.com" || url.hostname.endsWith(".googleusercontent.com");
  } catch (error) {
    return false;
  }
}

function normalizeSavedItemId(value) {
  if (!value) {
    return null;
  }

  if (value.startsWith("step:") || value.startsWith("intro:")) {
    return value;
  }

  return `step:${value}`;
}

function safelyParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function createSubmissionId() {
  return window.crypto && typeof window.crypto.randomUUID === "function"
    ? window.crypto.randomUUID()
    : `submission-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getText(value, language) {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : value[language] || value.en || "";
}

function formatStepCode(stepId) {
  return stepId.replaceAll("_", ".");
}
