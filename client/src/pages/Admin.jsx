import { useEffect, useState } from 'react';
import {
  ArrowUpRight, Atom, BookOpen, Box, CircleHelp, Compass, FlaskConical, Globe,
  Image, LayoutGrid, Link2, LogOut, Mail, PanelTop, RefreshCw, Save, Shield, Users,
} from 'lucide-react';
import { contentSchema } from '../../../server/content/contentSchema.js';
import ContentEditor from '../components/ContentEditor.jsx';
import api from '../lib/api.js';
import './admin.css';

const sessionKey = 'noema-admin-session';

const navigation = [
  { label: 'Website', links: [
    ['branding', Image], ['layout', LayoutGrid], ['navigation', Link2], ['metadata', Globe],
  ] },
  { label: 'Homepage', links: [
    ['hero', PanelTop], ['product', Box], ['about', BookOpen], ['research', FlaskConical],
    ['scientists', Atom], ['leadership', Users], ['visionMission', Compass], ['joinCta', CircleHelp], ['contact', Mail],
  ] },
  { label: 'Other content', links: [
    ['footer', PanelTop], ['legal', Shield],
  ] },
];
const hints = {
  branding: 'Manage the logo, company details, and social links used across the site.',
  layout: 'Move homepage sections into the order you want visitors to see. Set the website colors below.',
  navigation: 'Edit the links and buttons in the desktop and mobile menus.',
  hero: 'Edit the text, artwork, and buttons visitors see at the top of the homepage.',
  footer: 'Use {year} and {company} in the copyright text to insert the current year and legal company name.',
};

function readSession() {
  try { return sessionStorage.getItem(sessionKey) || ''; } catch { return ''; }
}

function rememberSession(token) {
  try {
    if (token) sessionStorage.setItem(sessionKey, token);
    else sessionStorage.removeItem(sessionKey);
  } catch {
    // The active session still works when storage is disabled.
  }
}

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
const errorMessage = (error, fallback) => error.response?.data?.message || fallback;

function Brand() {
  return (
    <div className="admin-brand">
      <span className="admin-brand-mark"><Atom size={22} aria-hidden="true" /></span>
      <div><strong>Noema</strong><span>Website admin</span></div>
    </div>
  );
}

function ViewWebsite() {
  return <a className="admin-button admin-secondary" href="/" target="_blank" rel="noreferrer">View website <ArrowUpRight size={16} aria-hidden="true" /></a>;
}

function Login({ onLogin, expired }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event) {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/api/admin/login', credentials);
      onLogin(data.token);
    } catch (err) {
      setError(errorMessage(err, 'The API could not be reached. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell admin-login">
      <div className="admin-login-card">
        <Brand />
        <h1>Sign in</h1>
        <p>{expired ? 'Your session expired. Sign in again to continue editing.' : 'Sign in to manage the Noema website.'}</p>
        <form onSubmit={signIn} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" name="email" required autoComplete="username" />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" name="password" required autoComplete="current-password" />
          </div>
          {error && <p className="admin-notice admin-error" role="alert">{error}</p>}
          <button className="admin-button admin-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <ViewWebsite />
      </div>
    </main>
  );
}

export default function Admin() {
  const [token, setToken] = useState(readSession);
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [current, setCurrent] = useState('hero');
  const [loadKey, setLoadKey] = useState(0);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [expired, setExpired] = useState(false);
  const dirty = Boolean(saved && draft !== saved.content);
  const busy = status === 'saving' || status === 'loading';

  function handleToken(value) {
    rememberSession(value);
    setToken(value);
  }

  function expireSession() {
    setExpired(true);
    handleToken('');
  }

  useEffect(() => { document.title = 'Website admin · Noema'; }, []);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    if (expired) {
      setExpired(false);
      setStatus('ready');
      setMessage('');
      return;
    }

    setStatus('loading');
    setMessage('');
    api.get('/api/admin/content', { ...auth(token), signal: controller.signal })
      .then(({ data }) => {
        setSaved(data);
        setDraft(data.content);
        setStatus('ready');
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.response?.status === 401) {
          rememberSession('');
          setToken('');
          return;
        }
        setStatus('loadError');
        setMessage(errorMessage(error, 'Website content could not be loaded. Try again.'));
      });
    return () => controller.abort();
    // A fresh sign-in for an expired session keeps any unsaved draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loadKey]);

  useEffect(() => {
    if (!dirty) return;
    const preventLostChanges = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', preventLostChanges);
    return () => window.removeEventListener('beforeunload', preventLostChanges);
  }, [dirty]);

  function reload() {
    if (dirty && !window.confirm('Discard your changes and load the published version?')) return;
    setLoadKey((key) => key + 1);
  }

  async function logout() {
    if (dirty && !window.confirm('Sign out and discard your unpublished changes?')) return;
    const activeToken = token;
    handleToken('');
    setSaved(null);
    setDraft(null);
    setExpired(false);
    setMessage('');
    await api.post('/api/admin/logout', undefined, auth(activeToken)).catch(() => {});
  }

  async function publish(event) {
    event.preventDefault();
    if (!dirty || busy) return;
    setStatus('saving');
    setMessage('');
    try {
      const { data } = await api.put('/api/admin/content', { revision: saved.revision, content: draft }, auth(token));
      setSaved(data);
      setDraft(data.content);
      setStatus('ready');
      setMessage('Changes published.');
    } catch (error) {
      if (error.response?.status === 401) {
        expireSession();
        return;
      }
      setStatus(error.response?.status === 409 ? 'conflict' : 'publishError');
      setMessage(errorMessage(error, 'Changes could not be published. Try again.'));
    }
  }

  if (!token) return <Login onLogin={handleToken} expired={expired} />;
  const section = contentSchema[current];

  return (
    <div className="admin-shell admin-layout">
      <aside className="admin-sidebar">
        <Brand />
        <nav aria-label="Editor sections" className="admin-nav">
          {navigation.map(({ label, links }) => (
            <div className="admin-nav-group" key={label}>
              <h2>{label}</h2>
              {links.map(([key, Icon]) => (
                <button key={key} type="button" aria-current={current === key ? 'true' : undefined}
                  onClick={() => setCurrent(key)}>
                  <Icon size={17} aria-hidden="true" /> {contentSchema[key].label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <button className="admin-button admin-logout" type="button" onClick={logout} disabled={status === 'saving'}><LogOut size={17} aria-hidden="true" /> Sign out</button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Content editor</span>
            {saved && <span className={`admin-status ${dirty ? 'admin-status-draft' : ''}`}>{dirty ? 'Unpublished changes' : 'Up to date'}</span>}
          </div>
          <div className="admin-topbar-actions">
            <ViewWebsite />
            <button className="admin-button admin-primary" type="submit" form="content-editor" disabled={!dirty || busy || status === 'conflict' || status === 'loadError'}>
              <Save size={16} aria-hidden="true" /> {status === 'saving' ? 'Publishing…' : 'Publish changes'}
            </button>
          </div>
        </header>

        <div className="admin-workspace">
          <header className="admin-section-heading">
            <h1>{section.label}</h1>
            {hints[current] && <p>{hints[current]}</p>}
          </header>

          {message && (
            <div className={`admin-notice ${status === 'ready' ? 'admin-success' : 'admin-error'}`} role={status === 'ready' ? 'status' : 'alert'}>
              {message}
              {['loadError', 'conflict'].includes(status) && <button type="button" className="admin-button admin-secondary" onClick={reload}>
                <RefreshCw size={16} aria-hidden="true" /> {status === 'conflict' ? 'Reload published content' : 'Try again'}
              </button>}
            </div>
          )}

          {status === 'loading' && <p className="admin-notice" role="status">Loading content…</p>}
          {draft && !['loading', 'loadError'].includes(status) && (
            <form id="content-editor" onSubmit={publish} noValidate className="admin-panel">
              {Object.hasOwn(section.fields, 'enabled') && (
                <div className="admin-panel-heading">
                  <span className="admin-visibility">{draft[current].enabled ? 'Visible on the homepage' : 'Hidden from the homepage'}</span>
                </div>
              )}
              <fieldset disabled={busy}>
                <legend className="sr-only">{section.label} settings</legend>
                <ContentEditor key={current} fields={section.fields} value={draft[current]}
                  onChange={(value) => {
                    setDraft((previous) => ({ ...previous, [current]: value }));
                    if (status !== 'conflict') setMessage('');
                  }} />
              </fieldset>
              {dirty && <footer className="admin-panel-footer">
                <button type="button" className="admin-button admin-quiet" disabled={busy}
                  onClick={() => {
                    if (!window.confirm('Discard all unpublished changes?')) return;
                    setDraft(saved.content);
                    if (status !== 'conflict') { setStatus('ready'); setMessage(''); }
                  }}>Discard changes</button>
              </footer>}
            </form>
          )}
          {saved?.publishedAt && <p className="admin-published">Last published {new Date(saved.publishedAt).toLocaleString()}</p>}
        </div>
      </main>
    </div>
  );
}

