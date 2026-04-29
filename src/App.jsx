import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const INTRO_SECTION_IDS = new Set(["A", "B", "C", "D", "E", "F", "G"]);
const TRANSITION_MS = 420;
const AUTO_ADVANCE_DELAY = 180;

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
  const autoAdvanceTimeoutRef = useRef(null);

  const visibleSteps = useMemo(() => getVisibleSteps(survey.steps, answers), [survey.steps, answers]);
  const flowItems = useMemo(() => buildFlowItems(visibleSteps), [visibleSteps]);

  useEffect(() => {
    return () => clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);
  }, []);

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

    const target = formRef.current?.querySelector(
      "[data-autofocus='true'], input, button[data-select-trigger='true'], textarea, button[type='submit']"
    );
    target?.focus({ preventScroll: true });
  }, [displayItemId, submittedRecord, transition]);

  useEffect(() => {
    const onKeyDown = async (event) => {
      if (transition || submitting || submittedRecord) {
        return;
      }

      const activeElement = document.activeElement;
      const isTextarea = activeElement?.tagName === "TEXTAREA";

      if (event.key !== "Enter" || event.shiftKey || isTextarea) {
        return;
      }

      if (activeElement?.dataset?.selectTrigger === "true") {
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

  async function moveFlowItem(direction, answersSnapshot = answers) {
    if (transition) {
      return;
    }

    clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);

    const targetFlowItems = buildFlowItems(getVisibleSteps(survey.steps, answersSnapshot));
    const currentIndex = targetFlowItems.findIndex((item) => item.id === displayItemId);
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= targetFlowItems.length) {
      return;
    }

    const nextItemId = targetFlowItems[nextIndex].id;
    setErrors({});
    setAlertMessage("");
    await transitionTo(nextItemId, direction > 0 ? "forward" : "backward");
  }

  async function advanceFlow() {
    if (transition) {
      return;
    }

    clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);

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
    clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);

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

  async function requestAutoAdvance(step, field, nextValue) {
    if (transition || submitting || submittedRecord) {
      return;
    }

    if (!shouldAutoAdvanceField(step, field, nextValue)) {
      return;
    }

    clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);

    autoAdvanceTimeoutRef.current = window.setTimeout(async () => {
      autoAdvanceTimeoutRef.current = null;

      const currentItem = getCurrentFlowItem(flowItems, displayItemId);

      if (!currentItem || currentItem.type !== "step" || currentItem.step.id !== step.id) {
        return;
      }

      const predictedAnswers = { ...answers, [field.id]: nextValue };
      const nextErrors = validateStep(step, predictedAnswers, survey, language);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }

      if (currentItem.id === flowItems[flowItems.length - 1]?.id) {
        await handleSubmit();
        return;
      }

      await moveFlowItem(1, predictedAnswers);
    }, AUTO_ADVANCE_DELAY);
  }

  async function handleSubmit(event) {
    event?.preventDefault();

    if (transition || submitting || submittedRecord) {
      return;
    }

    clearAutoAdvanceTimeout(autoAdvanceTimeoutRef);

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

  const canMoveDown = !submittedRecord && !submitting && !transition;
  const canMoveUp = canMoveDown && Boolean(activeView?.canGoBack);

  return (
    <div className="page-shell">
      <div className="top-progress" aria-hidden="true">
        <div className="top-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <header className="topbar">
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
                    onAutoAdvance: requestAutoAdvance,
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
                    onAutoAdvance: requestAutoAdvance,
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
                  onAutoAdvance: requestAutoAdvance,
                  onNavigateBack: () => moveFlowItem(-1),
                  onNavigateNext: () => advanceFlow(),
                  onRestart: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                  onSubmit: handleSubmit
                })}
              </div>
            )}
          </form>

          {!submittedRecord ? (
            <div className="floating-nav" aria-label="Question navigation">
              <button
                type="button"
                className="floating-nav-button"
                onClick={() => moveFlowItem(-1)}
                disabled={!canMoveUp}
                aria-label={getText(survey.ui.previous, language)}
              >
                <svg className="nav-chevron-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path fill="currentColor" d="M6.737 4.612a2 2 0 0 1 2.677.138l5.543 5.543.068.076a1 1 0 0 1-1.406 1.406l-.076-.068L8 6.164l-5.543 5.543a1 1 0 1 1-1.414-1.414L6.586 4.75z"></path>
                </svg>
              </button>
              <button
                type="button"
                className="floating-nav-button"
                onClick={() => {
                  if (activeView.type === "intro") {
                    moveFlowItem(1);
                    return;
                  }

                  if (activeView.isLast) {
                    handleSubmit();
                    return;
                  }

                  advanceFlow();
                }}
                disabled={!canMoveDown}
                aria-label={activeView.type === "intro" ? getText(survey.ui.continue, language) : getText(survey.ui.next, language)}
              >
                <svg className="nav-chevron-svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path fill="currentColor" d="M6.737 11.388a2 2 0 0 0 2.677-.138l5.543-5.543.068-.076a1 1 0 0 0-1.406-1.406l-.076.068L8 9.836 2.457 4.293a1 1 0 1 0-1.414 1.414l5.543 5.543z"></path>
                </svg>
              </button>
            </div>
          ) : null}
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
          <div className="success-headline">
            <div className="success-badge" aria-hidden="true" />
            <h2 className="success-title">{view.title}</h2>
          </div>
          <p className="success-copy">{view.copy}</p>
          <p className="support-note">{view.support}</p>
        </div>
      </section>
    );
  }

  if (view.type === "intro") {
    return (
      <section className="section-intro-shell">
        <div className="section-intro-panel">
          <span className="section-intro-kicker" aria-hidden="true">
            "
          </span>
          <h2 className="section-intro-title">{view.title}</h2>
          {view.copy ? <p className="section-intro-copy">{view.copy}</p> : null}
          <div className="section-intro-actions">
            <button type="button" className="button button-primary" onClick={props.onNavigateNext}>
              {getText(props.survey.ui.continue, props.language)}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="step-shell">
      <div className="step-main">
        <div className="step-header">
          <div className="step-headline">
            <span className="question-badge">{view.questionNumber}</span>
            <h2 className="question-title">
              {view.title}
              {view.required ? <span className="required-mark">*</span> : null}
            </h2>
          </div>
        </div>

        <div className="field-stack">
          {view.description ? <p className="field-stack-description">{view.description}</p> : null}
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
              onAutoAdvance={props.onAutoAdvance}
            />
          ))}
        </div>
      </div>

      <div className="nav-row">
        <div className="button-group">
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

function FieldRenderer({ field, step, language, answers, errors, survey, onFieldChange, onAutoAdvance }) {
  const stepTitle = buildQuestionTitle(step, survey, language);
  const hasError = Boolean(errors[field.id]);
  const otherFieldId = getOtherFieldId(field);
  const showOtherField = otherFieldId && answers[field.id] === "other";

  if (field.type === "consent") {
    return (
      <div className={`field-card compact${hasError ? " error-field" : ""}`}>
        {field.copy ? <p className="consent-support-copy">{getText(field.copy, language)}</p> : null}
        <label className="consent-toggle">
          <input
            type="checkbox"
            name={field.id}
            checked={answers[field.id] === "yes"}
            onChange={(event) => {
              const nextValue = event.target.checked ? "yes" : "";
              onFieldChange(field.id, nextValue);

              if (nextValue) {
                onAutoAdvance(step, field, nextValue);
              }
            }}
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
      <div className={`field-card${hasError || errors[otherFieldId] ? " error-field" : ""}`}>
        <SelectField
          field={field}
          language={language}
          answers={answers}
          survey={survey}
          stepTitle={stepTitle}
          onFieldChange={onFieldChange}
          onAutoAdvance={(value) => onAutoAdvance(step, field, value)}
        />
        {showOtherField ? (
          <div className="other-input-wrap">
            <input
              type="text"
              className="other-input"
              name={otherFieldId}
              data-autofocus="true"
              value={answers[otherFieldId] || ""}
              placeholder={getText(survey.ui.specifyOtherPlaceholder, language)}
              onChange={(event) => onFieldChange(otherFieldId, event.target.value)}
            />
          </div>
        ) : null}
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
        {errors[otherFieldId] ? <p className="error-text">{errors[otherFieldId]}</p> : null}
      </div>
    );
  }

  if (field.type === "radio") {
    const longOptions = field.options.some((option) => getText(option.label, language).length > 48);

    return (
      <div className={`field-card${hasError || errors[otherFieldId] ? " error-field" : ""}`}>
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
                onChange={(event) => {
                  onFieldChange(field.id, event.target.value);

                  if (otherFieldId && event.target.value !== "other") {
                    onFieldChange(otherFieldId, "");
                  }

                  onAutoAdvance(step, field, event.target.value);
                }}
              />
              <span className="choice-label">
                <span className="option-chip">{String.fromCharCode(65 + index)}</span>
                <span className="choice-copy">{getText(option.label, language)}</span>
              </span>
            </label>
          ))}
        </div>
        {showOtherField ? (
          <div className="other-input-wrap">
            <input
              type="text"
              className="other-input"
              name={otherFieldId}
              data-autofocus="true"
              value={answers[otherFieldId] || ""}
              placeholder={getText(survey.ui.specifyOtherPlaceholder, language)}
              onChange={(event) => onFieldChange(otherFieldId, event.target.value)}
            />
          </div>
        ) : null}
        {errors[field.id] ? <p className="error-text">{errors[field.id]}</p> : null}
        {errors[otherFieldId] ? <p className="error-text">{errors[otherFieldId]}</p> : null}
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
    const groupError = hasScaleError ? errors[field.items.find((item) => errors[item.id])?.id] : "";

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
          <span className="scale-head-spacer">&nbsp;</span>
          {field.scale.map((option) => (
            <span key={option.value} className="scale-head-value">
              {option.value}
            </span>
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
            </div>
          ))}
        </div>
        {groupError ? <p className="error-text scale-group-error">{groupError}</p> : null}
      </div>
    );
  }

  return null;
}

function SelectField({ field, language, answers, survey, stepTitle, onFieldChange, onAutoAdvance }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const selectedValue = answers[field.id] || "";
  const selectedOption = field.options.find((option) => option.value === selectedValue);
  const filteredOptions = field.options.filter((option) =>
    getText(option.label, language).toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={`select-field${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="select-trigger"
        name={field.id}
        data-select-trigger="true"
        aria-label={stepTitle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={`select-trigger-copy${selectedOption ? " has-value" : ""}`}>
          {selectedOption ? getText(selectedOption.label, language) : getText(survey.ui.selectPlaceholder, language)}
        </span>
        <span className={`select-trigger-chevron${isOpen ? " is-open" : ""}`} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path fill="currentColor" d="M6.737 11.388a2 2 0 0 0 2.677-.138l5.543-5.543.068-.076a1 1 0 0 0-1.406-1.406l-.076.068L8 9.836 2.457 4.293a1 1 0 1 0-1.414 1.414l5.543 5.543z"></path>
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="select-panel">
          <div className="select-search-row">
            <input
              type="text"
              className="select-search-input"
              value={query}
              placeholder={getText(survey.ui.selectPlaceholder, language)}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span className="select-search-icon" aria-hidden="true">
              ⌕
            </span>
          </div>

          <div className="select-options" role="listbox" aria-label={stepTitle}>
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`select-option-card${selectedValue === option.value ? " is-selected" : ""}`}
                onClick={() => {
                  onFieldChange(field.id, option.value);

                  const nestedOtherFieldId = getOtherFieldId(field);

                  if (nestedOtherFieldId && option.value !== "other") {
                    onFieldChange(nestedOtherFieldId, "");
                  }

                  setIsOpen(false);
                  setQuery("");
                  onAutoAdvance(option.value);
                }}
              >
                {getText(option.label, language)}
              </button>
            ))}

            {filteredOptions.length === 0 ? (
              <div className="select-empty-state">{getText(survey.ui.noMatchingOptions, language)}</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
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

    const otherFieldId = getOtherFieldId(field);

    if (otherFieldId && answers[field.id] === "other" && !String(answers[otherFieldId] || "").trim()) {
      errors[otherFieldId] = getText(survey.ui.specifyOtherError, language);
    }
  });

  return errors;
}

function buildView({ survey, flowItems, displayItemId, language, submittedRecord, justSubmitted }) {
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
    return joinBlocks([
      getText(survey.meta.description, language),
      getText(step.description || "", language)
    ]);
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
  return step.fields.flatMap((field) => {
    if (field.type === "scaleGroup") {
      return field.items.map((item) => item.id);
    }

    const ids = [field.id];
    const otherFieldId = getOtherFieldId(field);

    if (otherFieldId) {
      ids.push(otherFieldId);
    }

    return ids;
  });
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

function getOtherFieldId(field) {
  return hasOtherOption(field) ? `${field.id}_other` : "";
}

function hasOtherOption(field) {
  return Array.isArray(field.options) && field.options.some((option) => option.value === "other");
}

function shouldAutoAdvanceField(step, field, nextValue) {
  if (!step || step.fields.length !== 1 || !nextValue) {
    return false;
  }

  if (field.type === "consent") {
    return nextValue === "yes";
  }

  if (field.type !== "radio" && field.type !== "select") {
    return false;
  }

  return !(hasOtherOption(field) && nextValue === "other");
}

function clearAutoAdvanceTimeout(timeoutRef) {
  if (timeoutRef.current) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
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

function joinBlocks(parts) {
  return parts.filter(Boolean).join(" ");
}
