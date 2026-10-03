import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import {
  analyzeManuscript,
  buildPrintProofHtml,
  buildProductionReport,
  safeAutoFix
} from '../utils/onedaybooksEngine';

const STAGES = [
  { key: 'intake', label: '접수', note: '원고·저자·목적 확인' },
  { key: 'scope', label: '범위확정', note: '작업 범위·권리·산출물 확정' },
  { key: 'production', label: '제작', note: '편집·교정·디자인·파일 제작' },
  { key: 'qa', label: 'QA', note: '편집·권리·프리플라이트·버전 검수' },
  { key: 'approval', label: '승인', note: '저자 최종 승인' },
  { key: 'release', label: '출간', note: 'ISBN·서점·인쇄 등 외부 절차 연결' },
  { key: 'measure', label: '실측', note: '시간·개입·오류·재작업 기록' }
];

const QA_GATES = [
  { key: 'editorial', label: 'Editorial', note: '문장·구조·편집 기준 통과' },
  { key: 'rights', label: 'Rights', note: '텍스트·이미지·폰트 권리 확인' },
  { key: 'preflight', label: 'Preflight', note: '출력·전자책 파일 사전검사' },
  { key: 'version', label: 'Version', note: '최종 승인본과 배포본 버전 일치' }
];

const EMPTY_PROJECT = {
  title: '',
  author: '',
  objective: '전자책',
  stageIndex: 0,
  startedAt: null,
  internalCompletedAt: null,
  humanMinutes: 0,
  interventionCount: 0,
  qa: {
    editorial: false,
    rights: false,
    preflight: false,
    version: false
  },
  notes: '',
  fileName: '',
  charCount: 0
};

function fmtDuration(ms) {
  if (!ms || ms < 0) return '0분';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  if (min >= 60) return `${Math.floor(min / 60)}시간 ${min % 60}분`;
  return `${min}분 ${sec}초`;
}

export default function OneDayBooksOS() {
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [now, setNow] = useState(Date.now());
  const [loaded, setLoaded] = useState(false);
  const [manuscript, setManuscript] = useState('');
  const [processedManuscript, setProcessedManuscript] = useState('');
  const [engineAnalysis, setEngineAnalysis] = useState(null);
  const [engineRunAt, setEngineRunAt] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('onedaybooks-os-project');
      if (saved) setProject({ ...EMPTY_PROJECT, ...JSON.parse(saved) });
    } catch (_) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem('onedaybooks-os-project', JSON.stringify(project));
  }, [project, loaded]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const internalElapsed = useMemo(() => {
    if (!project.startedAt) return 0;
    const end = project.internalCompletedAt || now;
    return Math.max(0, end - project.startedAt);
  }, [project.startedAt, project.internalCompletedAt, now]);

  const qaCount = Object.values(project.qa).filter(Boolean).length;
  const publicationReady = project.stageIndex >= 4 && qaCount === QA_GATES.length;
  const withinTarget = internalElapsed > 0 && internalElapsed <= 60 * 60 * 1000;

  function updateField(key, value) {
    setProject((p) => ({ ...p, [key]: value }));
  }

  function startProject() {
    setProject((p) => ({
      ...p,
      startedAt: p.startedAt || Date.now(),
      stageIndex: Math.max(p.stageIndex, 0)
    }));
  }

  function moveStage(nextIndex) {
    setProject((p) => {
      const internalDone = nextIndex >= 4 && !p.internalCompletedAt
        ? Date.now()
        : p.internalCompletedAt;
      return {
        ...p,
        stageIndex: Math.max(0, Math.min(STAGES.length - 1, nextIndex)),
        internalCompletedAt: internalDone
      };
    });
  }

  function addHumanMinutes(minutes) {
    setProject((p) => ({
      ...p,
      humanMinutes: p.humanMinutes + minutes,
      interventionCount: p.interventionCount + 1
    }));
  }

  function toggleQa(key) {
    setProject((p) => ({
      ...p,
      qa: { ...p.qa, [key]: !p.qa[key] }
    }));
  }

  function resetProject() {
    if (!window.confirm('현재 프로젝트 기록을 초기화할까요?')) return;
    setProject(EMPTY_PROJECT);
    setManuscript('');
    setProcessedManuscript('');
    setEngineAnalysis(null);
    setEngineRunAt(null);
  }

  function downloadText(name, content, type = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function runProductionEngine() {
    if (!manuscript) return;
    const result = safeAutoFix(manuscript);
    setProcessedManuscript(result.text);
    setEngineAnalysis(result.analysis);
    setEngineRunAt(Date.now());
    setProject((p) => ({
      ...p,
      stageIndex: Math.max(p.stageIndex, 3),
      notes: p.notes
    }));
  }

  function exportCleanManuscript() {
    if (!processedManuscript) return;
    const safeTitle = (project.title || 'manuscript').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    downloadText(`${safeTitle}_clean.txt`, processedManuscript);
  }

  function exportPrintProof() {
    if (!processedManuscript) return;
    const safeTitle = (project.title || 'book').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    const html = buildPrintProofHtml({
      title: project.title || '제목 없음',
      author: project.author || '',
      manuscript: processedManuscript
    });
    downloadText(`${safeTitle}_140x210_proof.html`, html, 'text/html;charset=utf-8');
  }

  function exportProductionReport() {
    if (!manuscript) return;
    const report = buildProductionReport({
      title: project.title,
      author: project.author,
      objective: project.objective,
      originalText: manuscript,
      processedText: processedManuscript || manuscript
    });
    const safeTitle = (project.title || 'project').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    downloadText(
      `onedaybooks_${safeTitle}_production_report.json`,
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8'
    );
  }

  function exportJson() {
    const payload = {
      product: 'OneDayBooks AI Publishing OS',
      measurement_scope: 'internal-production-only',
      external_exclusions: ['ISBN 발급', '서점 검수·등록', '인쇄', '배송'],
      exported_at: new Date().toISOString(),
      project: {
        ...project,
        internalElapsedMs: internalElapsed,
        internalElapsedMinutes: Math.round((internalElapsed / 60000) * 100) / 100,
        qaPassed: qaCount,
        publicationReady
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (project.title || 'project').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    a.href = url;
    a.download = `onedaybooks_${safeTitle}_metrics.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function readTextFile(file) {
    if (!file) return;
    const text = await file.text();
    setManuscript(text);
    setProcessedManuscript('');
    setEngineAnalysis(analyzeManuscript(text));
    setEngineRunAt(null);
    setProject((p) => ({
      ...p,
      fileName: file.name,
      charCount: text.length,
      startedAt: p.startedAt || Date.now()
    }));
  }

  return (
    <>
      <Head>
        <title>OneDayBooks OS | 원고에서 출간 가능한 책까지</title>
        <meta
          name="description"
          content="원고 접수부터 편집·디자인·QA·승인·출간 연결까지 통제하고 실측하는 OneDayBooks AI Publishing OS MVP."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="os-shell">
        <header className="hero">
          <div className="eyebrow">ONEDAYBOOKS · AI PUBLISHING OS / MVP</div>
          <h1>원고 하나가 들어오면<br />출간 가능한 책으로 나온다.</h1>
          <p className="hero-copy">
            지금은 딱 하나에 집중합니다. 최소한의 인간 개입으로
            <strong> 원고 → 제작 → QA → 승인</strong> 흐름을 반복 가능하게 만들고,
            그 시간을 실제 데이터로 남깁니다.
          </p>
          <div className="scope-note">
            내부 제작 목표: 60분 이내 · ISBN 발급, 서점 검수·등록, 인쇄·배송은 외부 일정으로 별도 측정
          </div>
        </header>

        <section className="metrics">
          <Metric label="내부 제작 시간" value={fmtDuration(internalElapsed)} emphasis={withinTarget} />
          <Metric label="인간 개입 시간" value={`${project.humanMinutes}분`} />
          <Metric label="인간 개입 횟수" value={`${project.interventionCount}회`} />
          <Metric label="QA 통과" value={`${qaCount}/${QA_GATES.length}`} emphasis={qaCount === QA_GATES.length} />
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">01 · INPUT</div>
              <h2>프로젝트 접수</h2>
            </div>
            <button className="ghost" onClick={resetProject}>초기화</button>
          </div>

          <div className="form-grid">
            <label>
              <span>책 제목</span>
              <input
                value={project.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="예: 나의 첫 번째 책"
              />
            </label>
            <label>
              <span>저자</span>
              <input
                value={project.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="저자명"
              />
            </label>
            <label>
              <span>출간 목표</span>
              <select value={project.objective} onChange={(e) => updateField('objective', e.target.value)}>
                <option>전자책</option>
                <option>종이책</option>
                <option>전자책 + 종이책</option>
                <option>출판사 투고</option>
              </select>
            </label>
            <label>
              <span>원고 파일</span>
              <input
                className="file"
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={(e) => readTextFile(e.target.files?.[0])}
              />
            </label>
          </div>

          {project.fileName && (
            <div className="file-info">
              {project.fileName} · 약 {project.charCount.toLocaleString()}자 · 브라우저에서만 읽음
            </div>
          )}

          <button className="primary" onClick={startProject} disabled={!!project.startedAt}>
            {project.startedAt ? '측정 중' : '제작 타이머 시작'}
          </button>
        </section>


        <section className="panel engine-panel">
          <div className="section-head">
            <div>
              <div className="kicker">02 · PRODUCTION ENGINE</div>
              <h2>원고를 자동으로 정리하고 검사</h2>
            </div>
            <span className={`status-pill ${engineRunAt ? 'ready' : ''}`}>
              {engineRunAt ? 'ENGINE RUN' : '대기'}
            </span>
          </div>

          <p className="muted">
            현재 v0.1은 사람 판단이 필요 없는 안전한 작업만 자동화합니다.
            줄바꿈·탭·연속 공백·문장부호 앞 공백을 정리하고,
            구조와 기계적 오류를 검사합니다. 내용·사실·권리는 임의로 바꾸지 않습니다.
          </p>

          <div className="engine-actions">
            <button className="primary" onClick={runProductionEngine} disabled={!manuscript}>
              원고 자동 정리 실행
            </button>
            <button className="secondary" onClick={exportCleanManuscript} disabled={!processedManuscript}>
              정리 원고 받기
            </button>
            <button className="secondary" onClick={exportPrintProof} disabled={!processedManuscript}>
              140×210 내지 프루프
            </button>
            <button className="secondary" onClick={exportProductionReport} disabled={!manuscript}>
              제작 리포트
            </button>
          </div>

          {engineAnalysis && (
            <>
              <div className="engine-metrics">
                <MiniMetric label="글자 수" value={engineAnalysis.charCount.toLocaleString()} />
                <MiniMetric label="문단" value={engineAnalysis.paragraphCount.toLocaleString()} />
                <MiniMetric label="감지 목차/장" value={engineAnalysis.headingCount.toLocaleString()} />
                <MiniMetric label="예상 내지 쪽수" value={`약 ${engineAnalysis.estimatedPrintPages}쪽`} />
              </div>

              <div className="issue-list">
                {engineAnalysis.issues.map((issue) => (
                  <div className="issue" key={issue.key}>
                    <span>{issue.label}</span>
                    <strong>{issue.count === 0 ? '통과' : `${issue.count}건`}</strong>
                  </div>
                ))}
              </div>

              <div className="human-boundary">
                <strong>사람 승인 유지:</strong>
                저자 의도 · 사실/인용 · 저작권 · 최종 편집디자인 · 최종 출간 승인
              </div>
            </>
          )}
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">03 · CONTROL PLANE</div>
              <h2>7단계 제작 흐름</h2>
            </div>
            <span className="status-pill">{STAGES[project.stageIndex].label}</span>
          </div>

          <div className="stage-list">
            {STAGES.map((stage, index) => {
              const done = index < project.stageIndex;
              const active = index === project.stageIndex;
              return (
                <button
                  key={stage.key}
                  className={`stage ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                  onClick={() => moveStage(index)}
                >
                  <span className="stage-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="stage-body">
                    <strong>{stage.label}</strong>
                    <small>{stage.note}</small>
                  </span>
                  <span className="stage-state">{done ? '완료' : active ? '진행' : '대기'}</span>
                </button>
              );
            })}
          </div>

          <div className="stage-actions">
            <button
              className="secondary"
              disabled={!project.startedAt || project.stageIndex === 0}
              onClick={() => moveStage(project.stageIndex - 1)}
            >
              이전 단계
            </button>
            <button
              className="primary"
              disabled={!project.startedAt || project.stageIndex === STAGES.length - 1}
              onClick={() => moveStage(project.stageIndex + 1)}
            >
              다음 단계 완료
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">04 · HUMAN-IN-THE-LOOP</div>
              <h2>인간 개입을 숨기지 않고 측정</h2>
            </div>
          </div>
          <p className="muted">
            수정, 판단, 권리 확인, 예외처리처럼 사람이 실제로 개입한 시간만 누적합니다.
          </p>
          <div className="button-row">
            <button className="secondary" onClick={() => addHumanMinutes(1)}>+1분</button>
            <button className="secondary" onClick={() => addHumanMinutes(5)}>+5분</button>
            <button className="secondary" onClick={() => addHumanMinutes(15)}>+15분</button>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">05 · QUALITY GATES</div>
              <h2>출간 가능 판정</h2>
            </div>
            <span className={`status-pill ${publicationReady ? 'ready' : ''}`}>
              {publicationReady ? 'PUBLICATION-READY' : '검수 필요'}
            </span>
          </div>

          <div className="qa-grid">
            {QA_GATES.map((gate) => (
              <button
                key={gate.key}
                className={`qa-card ${project.qa[gate.key] ? 'passed' : ''}`}
                onClick={() => toggleQa(gate.key)}
              >
                <span className="qa-check">{project.qa[gate.key] ? '✓' : '○'}</span>
                <span>
                  <strong>{gate.label}</strong>
                  <small>{gate.note}</small>
                </span>
              </button>
            ))}
          </div>

          <label className="notes">
            <span>오류·재작업·예외 메모</span>
            <textarea
              value={project.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="무엇이 멈췄고, 왜 사람이 개입했는지 기록"
              rows={4}
            />
          </label>
        </section>

        <section className="panel result-panel">
          <div>
            <div className="kicker">06 · EVIDENCE</div>
            <h2>감이 아니라 실측값으로 남깁니다.</h2>
            <p className="muted">
              이 기록이 쌓이면 ‘빠른 출판 서비스’가 아니라
              반복 가능한 Publishing OS라는 것을 증명할 수 있습니다.
            </p>
          </div>
          <div className="result-actions">
            <button className="primary" onClick={exportJson}>측정 데이터 내보내기</button>
          </div>
        </section>

        <footer>
          <strong>OneDayBooks</strong>
          <span>Service → Control Plane → Publishing OS</span>
        </footer>
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #f5f1e8; color: #171714; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", "Segoe UI", sans-serif; }
        button, input, select, textarea { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <style jsx>{`
        .os-shell {
          width: min(100% - 28px, 980px);
          margin: 0 auto;
          padding: 28px 0 72px;
        }
        .hero {
          padding: 34px 4px 28px;
          border-bottom: 1px solid #cfc7b8;
        }
        .eyebrow, .kicker {
          font-size: 12px;
          letter-spacing: .12em;
          font-weight: 800;
          text-transform: uppercase;
          color: #7a321f;
        }
        h1 {
          margin: 14px 0 16px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 1.06;
          letter-spacing: -.045em;
          font-weight: 700;
        }
        .hero-copy {
          max-width: 760px;
          margin: 0;
          font-size: clamp(17px, 2.3vw, 22px);
          line-height: 1.62;
        }
        .scope-note {
          margin-top: 20px;
          display: inline-block;
          border: 1px solid #b9ae9d;
          background: rgba(255,255,255,.36);
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin: 20px 0;
        }
        .panel {
          background: rgba(255,255,255,.55);
          border: 1px solid #d2c9ba;
          border-radius: 18px;
          padding: 22px;
          margin: 14px 0;
          box-shadow: 0 8px 30px rgba(55,40,22,.04);
        }
        .section-head {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        h2 {
          margin: 5px 0 0;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -.035em;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        label span {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 800;
        }
        input, select, textarea {
          width: 100%;
          border: 1px solid #bdb4a5;
          border-radius: 11px;
          background: #fffdf7;
          padding: 12px 13px;
          color: #171714;
          outline: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #7a321f;
          box-shadow: 0 0 0 3px rgba(122,50,31,.08);
        }
        .file { padding: 9px; }
        .file-info {
          margin: 12px 0 0;
          padding: 10px 12px;
          border-radius: 9px;
          background: #eee8dd;
          font-size: 13px;
        }
        .primary, .secondary, .ghost {
          min-height: 44px;
          border-radius: 10px;
          padding: 10px 15px;
          font-weight: 800;
          cursor: pointer;
        }
        .primary {
          margin-top: 16px;
          border: 1px solid #171714;
          background: #171714;
          color: #fffdf7;
        }
        .secondary {
          border: 1px solid #a99f90;
          background: transparent;
          color: #171714;
        }
        .ghost {
          min-height: auto;
          padding: 7px 9px;
          border: 0;
          background: transparent;
          text-decoration: underline;
        }
        button:disabled { opacity: .42; cursor: not-allowed; }
        .stage-list { display: grid; gap: 8px; }
        .stage {
          width: 100%;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr) auto;
          gap: 11px;
          align-items: center;
          text-align: left;
          border: 1px solid #d5ccbe;
          border-radius: 12px;
          padding: 12px;
          background: rgba(255,255,255,.35);
          color: inherit;
          cursor: pointer;
        }
        .stage.active { border-color: #7a321f; background: #fff8ed; }
        .stage.done { opacity: .72; }
        .stage-num { font: 700 13px/1 Georgia, serif; color: #7a321f; }
        .stage-body strong, .stage-body small { display: block; }
        .stage-body strong { font-size: 16px; }
        .stage-body small { margin-top: 3px; color: #6d675e; line-height: 1.4; }
        .stage-state { font-size: 12px; font-weight: 800; }
        .stage-actions, .button-row, .engine-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .stage-actions .primary, .engine-actions .primary { margin-top: 0; }
        .engine-actions { align-items: stretch; }
        .engine-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 18px;
        }
        .issue-list {
          display: grid;
          gap: 7px;
          margin-top: 14px;
        }
        .issue {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #ddd4c7;
          padding: 9px 2px;
          font-size: 13px;
        }
        .human-boundary {
          margin-top: 15px;
          padding: 12px;
          border-left: 3px solid #7a321f;
          background: #f6eee5;
          font-size: 13px;
          line-height: 1.55;
        }
        .status-pill {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          border-radius: 999px;
          padding: 6px 10px;
          background: #e8dfd1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .04em;
        }
        .status-pill.ready { background: #dce8d7; color: #244a2d; }
        .qa-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .qa-card {
          display: grid;
          grid-template-columns: 26px minmax(0, 1fr);
          gap: 9px;
          text-align: left;
          border: 1px solid #cfc5b6;
          border-radius: 12px;
          padding: 14px;
          background: #fffdf7;
          color: inherit;
          cursor: pointer;
        }
        .qa-card.passed { border-color: #63806a; background: #f0f5ed; }
        .qa-card strong, .qa-card small { display: block; }
        .qa-card small { margin-top: 4px; color: #6d675e; line-height: 1.45; }
        .qa-check { font-size: 18px; font-weight: 900; }
        .notes { display: block; margin-top: 16px; }
        .muted { margin: 0; color: #6d675e; line-height: 1.65; }
        .result-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 20px;
        }
        .result-actions .primary { white-space: nowrap; }
        footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 24px 4px 0;
          color: #6d675e;
          font-size: 12px;
        }
        @media (max-width: 720px) {
          .os-shell { width: min(100% - 22px, 980px); padding-top: 14px; }
          .hero { padding-top: 22px; }
          .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .form-grid, .qa-grid, .result-panel { grid-template-columns: 1fr; }
          .engine-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .panel { padding: 17px; border-radius: 15px; }
          .section-head { align-items: flex-start; }
          .stage { grid-template-columns: 32px minmax(0, 1fr); }
          .stage-state { grid-column: 2; }
          .stage-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .stage-actions button, .button-row button, .engine-actions button { width: 100%; }
          .engine-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .button-row { display: grid; grid-template-columns: repeat(3, 1fr); }
          footer { flex-direction: column; }
        }
      `}</style>
    </>
  );
}

function Metric({ label, value, emphasis }) {
  return (
    <div className={`metric ${emphasis ? 'emphasis' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <style jsx>{`
        .metric {
          min-width: 0;
          border: 1px solid #d2c9ba;
          background: rgba(255,255,255,.55);
          border-radius: 14px;
          padding: 14px;
        }
        .metric.emphasis { border-color: #63806a; background: #f0f5ed; }
        span {
          display: block;
          color: #6d675e;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
        }
        strong {
          display: block;
          margin-top: 6px;
          font-size: clamp(20px, 3vw, 28px);
          letter-spacing: -.04em;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}


function MiniMetric({ label, value }) {
  return (
    <div className="mini-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <style jsx>{`
        .mini-metric {
          min-width: 0;
          border: 1px solid #d7cdbf;
          border-radius: 11px;
          padding: 11px;
          background: #fffdf7;
        }
        span {
          display: block;
          font-size: 11px;
          color: #6d675e;
          font-weight: 800;
        }
        strong {
          display: block;
          margin-top: 5px;
          font-size: 18px;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}
