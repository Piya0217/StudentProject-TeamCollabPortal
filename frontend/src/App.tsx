import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, ArrowDownUp, Bell, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, Command, FileText, Filter, FolderKanban, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, MoreHorizontal, Plus, Search, Settings, Sun, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePortalStore } from './store/usePortalStore'
import { students } from './mocks/seed'
import LoginScene from './features/auth/LoginScene'
import type { Health, Project, Task, TaskStatus } from './types'

const nav = [
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Tasks', path: '/tasks', icon: CheckCircle2 },
  { label: 'Teams', path: '/teams', icon: Users },
  { label: 'Files', path: '/files', icon: FileText },
  { label: 'Reviews', path: '/reviews', icon: GraduationCap, faculty: true }
]
const statusOrder: TaskStatus[] = ['To do', 'In progress', 'In review', 'Done']
const healthIcon: Record<Health, string> = { 'On track': '✓', 'At risk': '!', 'Overdue': '×' }

function Avatar({ name, size = 'normal' }: { name: string; size?: 'normal' | 'small' }) {
  const colors = ['#DCEBFF', '#E8E2FA', '#DDF4E7', '#FBE8D5']
  const idx = Math.max(0, name.charCodeAt(0) % colors.length)
  return <span className={`avatar ${size === 'small' ? 'avatar-small' : ''}`} style={{ background: colors[idx] }} aria-label={name}>{name.split(' ').map(x => x[0]).slice(0, 2).join('')}</span>
}
function Status({ status }: { status: string }) {
  const cls = status.toLowerCase().replaceAll(' ', '-')
  const icon = status === 'Done' || status === 'On track' ? '✓' : status === 'In review' || status === 'At risk' ? '!' : status === 'Overdue' ? '×' : status === 'In progress' ? '◷' : '○'
  return <span className={`status status-${cls}`}><span aria-hidden="true">{icon}</span>{status}</span>
}
async function persistTaskStatus(update: (id: string, status: TaskStatus) => Promise<void>, id: string, status: TaskStatus) {
  try { await update(id, status); toast.success('Task status saved to PostgreSQL') }
  catch (error) { toast.error(error instanceof Error ? error.message : 'Could not update the task.') }
}
function Progress({ value, label = 'Project progress' }: { value: number; label?: string }) {
  return <div className="progress-wrap" aria-label={`${label}: ${value}%`} role="img"><div className="progress-track"><motion.div className="progress-fill" initial={{ transform: 'scaleX(0)' }} animate={{ transform: `scaleX(${value / 100})` }} transition={{ duration: .4, ease: [0.23, 1, 0.32, 1] }} /></div><span>{value}%</span></div>
}
function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button button-${variant}`}>{children}</button>
}
function Login() {
  const role = usePortalStore(s => s.role), setRole = usePortalStore(s => s.setRole), signIn = usePortalStore(s => s.signIn)
  const navigate = useNavigate()
  const [email, setEmail] = useState(role === 'Faculty' ? 'carol@example.com' : 'alice@example.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error('Enter a valid email address'); return }
    if (!password) { toast.error('Enter your password'); return }
    setSubmitting(true)
    try {
      const user = await signIn(email.trim(), password)
      toast.success('Signed in as ' + user.role)
      navigate(user.role === 'faculty' ? '/faculty' : '/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not sign in.')
    } finally { setSubmitting(false) }
  }
  return <main className="login-page">
    <section className="login-hero">
      <div className="brand"><span className="brand-mark"><GraduationCap size={21} /></span><span>Campus</span></div>
      <div className="hero-copy"><p className="hero-kicker">Your work, in sync.</p><h1>Great work<br />happens together.</h1><p>One calm place to plan projects, share progress, and make every milestone count.</p></div>
      <div className="hero-art"><LoginScene /></div>
      <div className="hero-footer"><span><span className="online-dot" /> Built for university teams</span><span>Project · Team · Tasks · Review</span></div>
    </section>
    <section className="login-form-side">
      <div className="mobile-brand brand"><span className="brand-mark"><GraduationCap size={21} /></span><span>Campus</span></div>
      <div className="login-form-content"><div className="login-heading"><h2>Welcome back</h2><p>Sign in to continue to your workspace.</p></div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required aria-describedby="email-hint" placeholder="you@example.com" /><small id="email-hint" className="field-hint">Accepts any valid email format (e.g. Gmail, Outlook, campus, or custom domain).</small>
          <div className="password-label"><label htmlFor="password">Password</label><button type="button" className="text-button" onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Enter your password" />
          <label className="role-label">Continue as</label><div className="segmented" role="group" aria-label="Choose account role"><button type="button" className={role === 'Student' ? 'selected' : ''} onClick={() => { setRole('Student'); setEmail('alice@example.com'); setPassword('password123') }}>Student</button><button type="button" className={role === 'Faculty' ? 'selected' : ''} onClick={() => { setRole('Faculty'); setEmail('carol@example.com'); setPassword('password123') }}>Faculty</button></div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Connecting…' : 'Sign in'} <span aria-hidden="true">↗</span></Button>
        </form><p className="demo-note"><CircleHelp size={15} /> Demo login: Alice / Bob / Carol · password123</p>
      </div><footer className="login-bottom"><span>Campus collaboration portal</span><span>Help · Privacy</span></footer>
    </section>
  </main>
}
function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = usePortalStore(s => s.theme), toggleTheme = usePortalStore(s => s.toggleTheme), role = usePortalStore(s => s.role), currentUser = usePortalStore(s => s.user), signOut = usePortalStore(s => s.signOut), resetDemo = usePortalStore(s => s.resetDemo)
  const [collapsed, setCollapsed] = useState(false), [search, setSearch] = useState(''), [menuOpen, setMenuOpen] = useState(false), [commandOpen, setCommandOpen] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandOpen(v => !v) } if (e.key === 'Escape') { setCommandOpen(false); setMenuOpen(false) } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [])
  const title = nav.find(n => n.path === location.pathname)?.label || ({ '/dashboard': 'Overview', '/faculty': 'Faculty overview', '/create': 'Create project', '/project': 'Project workspace', '/profile': 'Your profile' } as Record<string, string>)[location.pathname] || 'Workspace'
  const go = (path: string) => { navigate(path); setCommandOpen(false); setMenuOpen(false) }
  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className="sidebar">
      <button className="brand sidebar-brand" onClick={() => go('/dashboard')}><span className="brand-mark"><GraduationCap size={21} /></span>{!collapsed && <span>Campus</span>}</button>
      {!collapsed && <div className="workspace-switch"><span className="workspace-avatar">R</span><span><strong>REVA University</strong><small>Student workspace</small></span><ChevronDown size={15} /></div>}
      <div className="nav-label">{!collapsed ? 'Workspace' : ''}</div>
      <nav aria-label="Main navigation">{nav.filter(n => !n.faculty || role === 'Faculty').map(item => <Link key={item.path} to={item.path} title={collapsed ? item.label : undefined} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}><item.icon size={19} />{!collapsed && <span>{item.label}</span>}{item.label === 'Reviews' && !collapsed && <span className="nav-count">2</span>}</Link>)}</nav>
      <div className="sidebar-spacer" />
      <button className="nav-item" onClick={() => go('/profile')}><Users size={19} />{!collapsed && <span>Your profile</span>}</button>
      <button className="nav-item" onClick={() => toast.info('Help centre is part of the demo prototype.')}><CircleHelp size={19} />{!collapsed && <span>Help and support</span>}</button>
      <button className="collapse-button" onClick={() => setCollapsed(s => !s)}><Menu size={17} />{!collapsed && <span>Collapse sidebar</span>}</button>
      {!collapsed && <div className="sidebar-user"><Avatar name={currentUser?.name || 'Student'} /><span><strong>{currentUser?.name || role}</strong><small>{currentUser?.designation || role}</small></span><button aria-label="Open account menu" onClick={() => setMenuOpen(v => !v)}><MoreHorizontal size={18} /></button></div>}
    </aside>
    <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{title}</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input aria-label="Search projects and tasks" placeholder="Search anything..." value={search} onChange={e => setSearch(e.target.value)} /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Toggle light and dark theme" onClick={toggleTheme}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast('You’re all caught up.')}><Bell size={18} /><i /></button><button className="top-avatar" aria-label="Open profile" onClick={() => go('/profile')}>{currentUser?.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U'}</button></div></header>
    <main className="main-content" key={location.pathname}><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{children}</motion.div></AnimatePresence></main>
    <nav className="mobile-tabs" aria-label="Mobile navigation">{nav.filter(n => !n.faculty || role === 'Faculty').slice(0, 4).map(n => <Link key={n.path} to={n.path} className={location.pathname === n.path ? 'active' : ''}><n.icon size={20} /><span>{n.label}</span></Link>)}</nav>
    {menuOpen && <><button className="menu-scrim" aria-label="Close account menu" onClick={() => setMenuOpen(false)} /><div className="account-menu"><button onClick={() => go('/profile')}><Users size={16} /> Profile</button><button onClick={() => { resetDemo(); navigate('/login'); toast('Demo data reset') }}><ArrowDownUp size={16} /> Reset demo data</button><button onClick={() => { signOut(); navigate('/login') }}><LogOut size={16} /> Sign out</button></div></>}
    {commandOpen && <div className="command-scrim" onMouseDown={() => setCommandOpen(false)}><div className="command-dialog" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={e => e.stopPropagation()}><div className="command-search"><Search size={18} /><input autoFocus placeholder="Where would you like to go?" value={search} onChange={e => setSearch(e.target.value)} /><kbd>ESC</kbd></div><p className="command-caption">Navigation</p>{nav.filter(n => !n.faculty || role === 'Faculty').filter(n => n.label.toLowerCase().includes(search.toLowerCase())).map(n => <button className="command-item" key={n.path} onClick={() => go(n.path)}><n.icon size={17} />{n.label}<span>↵</span></button>)}<button className="command-item" onClick={() => go('/create')}><Plus size={17} />Create project<span>↵</span></button></div></div>}
  </div>
}
function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) { return <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div> }
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return <button className="project-card" onClick={onClick}><div className="project-card-top"><span className="project-symbol"><FolderKanban size={20} /></span><button className="inline-more" aria-label={`More options for ${project.title}`} onClick={e => { e.stopPropagation(); toast.info('Project options are available in the workspace.') }}><MoreHorizontal size={18} /></button></div><h3>{project.title}</h3><p>{project.summary}</p><div className="project-card-meta"><Status status={project.health} /><span><CalendarDays size={14} />{project.due}</span></div><Progress value={project.progress} /><div className="project-card-footer"><div className="avatar-stack">{project.team.slice(0, 3).map(n => <Avatar key={n} name={n} size="small" />)}</div><span>{project.team.length} members</span><span className="activity-text"><Activity size={13} />{project.lastActivity}</span></div></button>
}
function Dashboard() {
  const navigate = useNavigate(), projects = usePortalStore(s => s.projects), tasks = usePortalStore(s => s.tasks), user = usePortalStore(s => s.user), role = usePortalStore(s => s.role)
  const myTasks = tasks.filter(t => (role === 'Faculty' || t.assigneeId === user?.id) && t.status !== 'Done').slice(0, 4)
  return <div className="page">
    <PageHeading title={'Good morning, ' + (user?.name.split(' ')[0] || 'there')} subtitle="Here’s what’s happening with your projects today." action={<Button onClick={() => navigate('/create')}><Plus size={17} /> Create project</Button>} />
    <section className="welcome-strip"><div><span className="welcome-icon"><BookOpen size={20} /></span><div><strong>Keep your momentum going</strong><p>You have {myTasks.length} tasks to focus on and 2 milestones coming up this week.</p></div></div><button onClick={() => navigate('/tasks')}>View my tasks <span>↗</span></button></section>
    <div className="section-heading"><div><h2>Your projects</h2><p>Track progress across your active work.</p></div><button className="text-button" onClick={() => navigate('/projects')}>View all <span>↗</span></button></div>
    <div className="project-grid">{projects.slice(0, 3).map(p => <ProjectCard key={p.id} project={p} onClick={() => navigate(`/project?id=${p.id}`)} />)}</div>
    <div className="dashboard-lower">
    <section className="surface-panel"><div className="panel-heading"><div><h2>{role === 'Faculty' ? 'Tasks across your projects' : 'Tasks due soon'}</h2><p>Your next steps, all in one place.</p></div><button className="text-button" onClick={() => navigate('/tasks')}>All tasks</button></div>
        {myTasks.length ? myTasks.map(t => <TaskRow key={t.id} task={t} />) : <Empty title="You’re all caught up" body="New tasks assigned to you will appear here." />}
      </section>
      <section className="surface-panel"><div className="panel-heading"><div><h2>Upcoming milestones</h2><p>Keep an eye on these dates.</p></div><CalendarDays size={18} className="muted-icon" /></div>
        {projects.slice(0, 3).map((p, i) => <div className="milestone-row" key={p.id}><span className={`milestone-dot dot-${i}`} /><div><strong>{p.nextMilestone}</strong><small>{p.title}</small></div><time>{['Oct 29', 'Nov 02', 'Nov 05'][i]}</time></div>)}
      </section>
    </div>
    <section className="activity-feed"><div className="panel-heading"><div><h2>Team activity</h2><p>Recent updates from your collaborators.</p></div><Activity size={18} className="muted-icon" /></div><div className="activity-line"><Avatar name="Meera Iyer" size="small" /><p><strong>Meera Iyer</strong> updated the interface draft in <strong>IoT campus monitor</strong><small>12 minutes ago</small></p><span className="activity-pill">Task update</span></div><div className="activity-line"><Avatar name="Diya Nair" size="small" /><p><strong>Diya Nair</strong> shared research notes in <strong>Placement insights</strong><small>1 hour ago</small></p><span className="activity-pill">File shared</span></div></section>
  </div>
}
function TaskRow({ task }: { task: Task }) {
  const update = usePortalStore(s => s.updateTaskStatus)
  return <div className="task-row"><button className={`task-check ${task.status === 'Done' ? 'checked' : ''}`} aria-label={`Mark ${task.title} ${task.status === 'Done' ? 'to do' : 'done'}`} onClick={() => void persistTaskStatus(update, task.id, task.status === 'Done' ? 'To do' : 'Done')}>{task.status === 'Done' && <Check size={14} />}</button><div className="task-row-main"><strong>{task.title}</strong><small>{task.projectId.toUpperCase()} · {task.due}</small></div><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div>
}
function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) { return <div className="empty-state"><span className="empty-icon"><FolderKanban size={21} /></span><strong>{title}</strong><p>{body}</p>{action}</div> }
function ProjectsPage() {
  const projects = usePortalStore(s => s.projects), navigate = useNavigate(), [filter, setFilter] = useState('All')
  const filtered = projects.filter(p => filter === 'All' || p.health === filter)
  return <div className="page"><PageHeading title="Projects" subtitle="All your team's work, in one view." action={<Button onClick={() => navigate('/create')}><Plus size={17} /> Create project</Button>} /><div className="toolbar-row"><div className="filter-tabs">{['All', 'On track', 'At risk', 'Overdue'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}<span>{f === 'All' ? projects.length : projects.filter(p => p.health === f).length}</span></button>)}</div><button className="button button-secondary" onClick={() => toast.info('Projects are sorted by recent activity.')}><Filter size={16} /> Filter</button></div><div className="project-grid projects-page-grid">{filtered.map(p => <ProjectCard key={p.id} project={p} onClick={() => navigate(`/project?id=${p.id}`)} />)}</div>{!filtered.length && <Empty title="No projects in this view" body="Choose another health filter to see more projects." />}</div>
}
function TasksPage() {
  const allTasks = usePortalStore(s => s.tasks), user = usePortalStore(s => s.user), update = usePortalStore(s => s.updateTaskStatus), projects = usePortalStore(s => s.projects), navigate = useNavigate()
  const tasks = user?.role === 'student' ? allTasks.filter(task => task.assigneeId === user.id) : allTasks
  const [filter, setFilter] = useState('All'), [query, setQuery] = useState('')
  const filtered = tasks.filter(t => (filter === 'All' || t.status === filter) && t.title.toLowerCase().includes(query.toLowerCase()))
  return <div className="page"><PageHeading title="Tasks" subtitle="A clear view of the next steps across your projects." action={<Button onClick={() => navigate(projects.length ? '/project?id=' + projects[0].id : '/projects')}><Plus size={17} /> New task</Button>} /><div className="toolbar-row"><div className="search-box table-search"><Search size={16} /><input aria-label="Search tasks" placeholder="Search tasks" value={query} onChange={e => setQuery(e.target.value)} /></div><select className="select-control" aria-label="Filter tasks by status" value={filter} onChange={e => setFilter(e.target.value)}>{['All', ...statusOrder].map(s => <option key={s}>{s}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Due date</th><th>Status</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td><div className="table-task"><span className="task-mini-check" onClick={() => void persistTaskStatus(update, t.id, t.status === 'Done' ? 'To do' : 'Done')} role="button" tabIndex={0} aria-label="Toggle task complete">{t.status === 'Done' ? <Check size={13} /> : null}</span><strong>{t.title}</strong></div></td><td>{t.projectId.toUpperCase()}</td><td><span className="table-assignee"><Avatar name={t.assignee} size="small" />{t.assignee}</span></td><td><span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td><td>{t.due}</td><td><select aria-label={`Status for ${t.title}`} className={`status-select status-${t.status.toLowerCase().replaceAll(' ', '-')}`} value={t.status} onChange={e => void persistTaskStatus(update, t.id, e.target.value as TaskStatus)}>{statusOrder.map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!filtered.length && <Empty title="No tasks found" body="Try a different search or status filter." />}</div></div>
}
const projectSchema = z.object({ title: z.string().min(3, 'Use at least 3 characters.'), summary: z.string().min(10, 'Add a little more detail.'), due: z.string().min(1, 'Choose a deadline.'), category: z.string().min(1) })
type ProjectForm = z.infer<typeof projectSchema>
function CreateProject() {
  const navigate = useNavigate(), addProject = usePortalStore(s => s.addProject), [step, setStep] = useState(1), [invited, setInvited] = useState<string[]>(['1']), [milestone, setMilestone] = useState('Research and planning'), [saved, setSaved] = useState(true)
  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<ProjectForm>({ resolver: zodResolver(projectSchema), defaultValues: { title: '', summary: '', due: '2026-11-30', category: 'Research' } })
  const title = watch('title')
  useEffect(() => { setSaved(false); const id = window.setTimeout(() => setSaved(true), 650); return () => window.clearTimeout(id) }, [title, step])
  const next = async () => { if (step === 1 && !await trigger(['title', 'summary', 'due', 'category'])) return; setStep(s => Math.min(4, s + 1)) }
  const submit = handleSubmit(async data => {
    const now = Date.now()
    const project: Project = {
      id: 'draft-' + now, title: data.title, summary: data.summary, health: 'On track', progress: 0,
      due: new Date(data.due + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      team: students.filter(student => invited.includes(student.id)).map(student => student.name),
      nextMilestone: milestone, lastActivity: 'Just now',
      milestones: [{ id: 'm' + now, title: milestone, due: data.due, status: 'Upcoming' }], facultyId: 3
    }
    try {
      const saved = await addProject(project, invited)
      toast.success('Project saved to PostgreSQL')
      navigate('/project?id=' + saved.id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create the project.')
    }
  })
  return <div className="page create-page"><PageHeading title="Create a project" subtitle="Set your team up for a clear, confident start." action={<span className="autosave"><span className={saved ? 'save-dot' : 'save-dot saving'} />{saved ? 'Draft saved' : 'Saving draft…'}</span>} /><div className="stepper">{['Details', 'Invite team', 'Milestones', 'Review'].map((label, i) => <button key={label} className={`step ${step === i + 1 ? 'current' : step > i + 1 ? 'complete' : ''}`} onClick={() => { if (i === 0 || i + 1 < step) setStep(i + 1) }}><span>{step > i + 1 ? <Check size={15} /> : i + 1}</span><strong>{label}</strong></button>)}</div><form className="form-panel" onSubmit={submit}>
    {step === 1 && <><div className="form-title"><h2>Project details</h2><p>Give your project a name and a shared goal.</p></div><label htmlFor="project-title">Project name</label><input id="project-title" {...register('title')} placeholder="e.g. Smart campus energy monitor" />{errors.title && <small className="error-text">{errors.title.message}</small>}<label htmlFor="summary">Project summary</label><textarea id="summary" {...register('summary')} rows={4} placeholder="What are you building, and what will success look like?" />{errors.summary && <small className="error-text">{errors.summary.message}</small>}<div className="form-grid"><div><label htmlFor="category">Project type</label><select id="category" {...register('category')} className="form-control"><option>Research</option><option>Software</option><option>IoT</option><option>Design</option><option>Data science</option></select></div><div><label htmlFor="due">Target deadline</label><input id="due" type="date" {...register('due')} />{errors.due && <small className="error-text">{errors.due.message}</small>}</div></div></>}
    {step === 2 && <><div className="form-title"><h2>Invite your team</h2><p>Choose collaborators by skill and availability.</p></div><div className="invite-list">{students.map(s => <div className="invite-person" key={s.id}><Avatar name={s.name} /><div className="invite-person-main"><strong>{s.name}</strong><small>{s.course} · {s.availability}</small><div className="skill-chips">{s.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div><Button variant={invited.includes(s.id) ? 'secondary' : 'primary'} onClick={() => setInvited(old => old.includes(s.id) ? old.filter(x => x !== s.id) : [...old, s.id])}>{invited.includes(s.id) ? <><Check size={15} /> Invited</> : <><Plus size={15} /> Invite</>}</Button></div>)}</div></>}
    {step === 3 && <><div className="form-title"><h2>Plan your milestones</h2><p>Start with a milestone your team can work towards.</p></div><label htmlFor="milestone">First milestone</label><input id="milestone" value={milestone} onChange={e => setMilestone(e.target.value)} required /><div className="milestone-preview"><span className="timeline-line" /><span className="timeline-node" /><div><strong>{milestone || 'Your first milestone'}</strong><small>Target: {watch('due') || 'Choose a deadline'}</small></div><Status status="Upcoming" /></div><div className="info-note"><CalendarDays size={18} /><p>You can add more milestones and dates from the project workspace after creation.</p></div></>}
    {step === 4 && <><div className="form-title"><h2>Review your project</h2><p>Check the details before creating your shared workspace.</p></div><div className="review-summary"><div><span>Project</span><strong>{watch('title') || 'Untitled project'}</strong><p>{watch('summary') || 'No summary added yet.'}</p></div><div className="review-two"><div><span>Type</span><strong>{watch('category')}</strong></div><div><span>Deadline</span><strong>{watch('due')}</strong></div></div><div><span>Team members</span><div className="review-people">{students.filter(s => invited.includes(s.id)).map(s => <span key={s.id}><Avatar name={s.name} size="small" />{s.name}</span>)}</div></div><div><span>First milestone</span><strong>{milestone}</strong></div></div></>}
    <div className="form-footer"><Button variant="secondary" onClick={() => step === 1 ? navigate('/projects') : setStep(s => s - 1)}>{step === 1 ? 'Cancel' : 'Back'}</Button><span>Step {step} of 4</span>{step < 4 ? <Button onClick={next}>Continue <span>↗</span></Button> : <Button type="submit"><Check size={16} /> Create project</Button>}</div>
  </form></div>
}
function ProjectWorkspace() {
  const params = new URLSearchParams(useLocation().search), id = params.get('id') || 'p1', navigate = useNavigate()
  const project = usePortalStore(s => s.projects.find(p => p.id === id)), tasks = usePortalStore(s => s.tasks), update = usePortalStore(s => s.updateTaskStatus)
  const role = usePortalStore(s => s.role)
  const [tab, setTab] = useState('Board'), [selected, setSelected] = useState<Task | null>(null), [newTask, setNewTask] = useState('')
  const scoped = tasks.filter(t => t.projectId === id)
  const createTask = usePortalStore(s => s.addTask); const addTask = async () => { if (!newTask.trim()) return; try { await createTask(id, newTask.trim()); toast.success('Task saved to PostgreSQL'); setNewTask('') } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not create the task.') } }
  if (!project) return <div className="page"><Empty title="Project not found" body="This project may have been removed from the demo data." action={<Button onClick={() => navigate('/projects')}>Back to projects</Button>} /></div>
  return <div className="page"><button className="back-link" onClick={() => navigate('/projects')}>← All projects</button><div className="workspace-title"><div><div className="workspace-title-line"><span className="project-symbol"><FolderKanban size={21} /></span><h1>{project.title}</h1><Status status={project.health} /></div><p>{project.summary}</p><div className="workspace-meta"><span><CalendarDays size={15} /> Due {project.due}</span><span><Users size={15} />{project.team.length} members</span><span><Activity size={15} /> Updated {project.lastActivity}</span></div></div><div className="workspace-progress"><Progress value={project.progress} /><small>Overall progress</small></div></div><div className="workspace-tabs">{['Board', 'List', 'Milestones', 'Files and links', 'Team', 'Activity'].map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === 'Board' && <><div className="board-toolbar"><div><strong>{scoped.length} tasks</strong><span> · Drag and drop status is also editable on each task</span></div><div className="board-add"><input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Quick task title" /><Button onClick={addTask}><Plus size={15} /> Add task</Button></div></div><div className="kanban-board">{statusOrder.map(status => <section key={status} className="kanban-column"><div className="kanban-column-heading"><span className={`column-dot status-dot-${status.toLowerCase().replaceAll(' ', '-')}`} /><strong>{status}</strong><span className="column-count">{scoped.filter(t => t.status === status).length}</span><button aria-label={`Add task to ${status}`} onClick={() => { setNewTask(''); toast.info('Enter a task in the quick-add field above.') }}><Plus size={16} /></button></div><div className="kanban-cards">{scoped.filter(t => t.status === status).map(t => <button className="kanban-card" key={t.id} onClick={() => setSelected(t)}><div className="kanban-card-top"><span className={`priority priority-${t.priority.toLowerCase()}`}>{t.priority} priority</span><MoreHorizontal size={16} /></div><strong>{t.title}</strong><p>{t.description.slice(0, 80)}…</p><div className="kanban-card-bottom"><span><CalendarDays size={13} />{t.due}</span><Avatar name={t.assignee} size="small" /></div><label className="move-task-label">Move to <select aria-label={`Move ${t.title}`} value={t.status} onClick={e => e.stopPropagation()} onChange={e => void persistTaskStatus(update, t.id, e.target.value as TaskStatus)}>{statusOrder.map(s => <option key={s}>{s}</option>)}</select></label></button>)}</div><button className="column-add" onClick={() => { setNewTask(''); toast.info('Use quick task title above to add a task.') }}><Plus size={15} /> Add task</button></section>)}</div></>}
    {tab === 'List' && <div className="table-wrap"><table><thead><tr><th>Task</th><th>Assignee</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead><tbody>{scoped.map(t => <tr key={t.id}><td>{t.title}</td><td>{t.assignee}</td><td>{t.priority}</td><td>{t.due}</td><td><select className="select-control" value={t.status} onChange={e => void persistTaskStatus(update, t.id, e.target.value as TaskStatus)}>{statusOrder.map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>}
    {tab === 'Milestones' && <div className="surface-panel milestone-timeline"><div className="timeline-line" />{project.milestones.map(m => <div className="timeline-item" key={m.id}><span className={`timeline-node ${m.status === 'Complete' ? 'done' : ''}`} /><div><strong>{m.title}</strong><small>{m.due}</small></div><Status status={m.status} /></div>)}</div>}
    {tab === 'Files and links' && <div className="surface-panel"><div className="panel-heading"><div><h2>Files and links</h2><p>Keep project resources in one place.</p></div><Button onClick={() => toast.info('File upload is represented in this frontend demo.')}><Plus size={16} /> Add file</Button></div><div className="upload-zone" onClick={() => toast.info('Connect a storage API to enable real uploads.')} role="button" tabIndex={0}><FileText size={25} /><strong>Drop files here or browse</strong><p>PDF, DOCX, PPTX and project links</p><small>Demo mode · files are not uploaded to a server</small></div><div className="file-row"><span className="file-icon"><FileText size={18} /></span><div><strong>Project brief.pdf</strong><small>Shared by Aarav Sharma · 2.4 MB</small></div><button aria-label="Open project brief" onClick={() => toast.info('Sample file preview is not connected.')}>Open ↗</button></div></div>}
    {tab === 'Team' && <div className="surface-panel"><div className="panel-heading"><div><h2>Project team</h2><p>Collaborators and their focus areas.</p></div>{role !== 'Faculty' && <Button onClick={() => navigate('/teams')}><Plus size={16} /> Invite teammate</Button>}</div>{project.team.map(n => <div className="team-roster-row" key={n}><Avatar name={n} /><div><strong>{n}</strong><small>{students.find(s => s.name === n)?.course || 'Faculty collaborator'}</small></div><span className="role-chip">{n === project.team[0] ? 'Project lead' : 'Member'}</span></div>)}</div>}
    {tab === 'Activity' && <div className="surface-panel"><div className="activity-line"><Avatar name="Meera Iyer" size="small" /><p><strong>Meera Iyer</strong> updated a task status<small>12 minutes ago</small></p></div><div className="activity-line"><Avatar name="Aarav Sharma" size="small" /><p><strong>Aarav Sharma</strong> added a project update<small>Yesterday</small></p></div></div>}
    {selected && <div className="drawer-scrim" onMouseDown={() => setSelected(null)}><aside className="task-drawer" role="dialog" aria-modal="true" aria-label="Task details" onMouseDown={e => e.stopPropagation()}><div className="drawer-head"><span>Task details</span><button aria-label="Close task details" onClick={() => setSelected(null)}><X size={19} /></button></div><h2>{selected.title}</h2><p className="drawer-description">{selected.description}</p><label>Status</label><select className="form-control" value={selected.status} onChange={e => { const status = e.target.value as TaskStatus; setSelected({ ...selected, status }); void persistTaskStatus(update, selected.id, status) }}>{statusOrder.map(s => <option key={s}>{s}</option>)}</select><label>Priority</label><p><span className={`priority priority-${selected.priority.toLowerCase()}`}>{selected.priority}</span></p><label>Assignee</label><div className="drawer-assignee"><Avatar name={selected.assignee} />{selected.assignee}</div><label>Due date</label><p>{selected.due}</p><label>Comments</label>{selected.comments.map((c, i) => <p className="comment" key={i}>{c}</p>)}<textarea placeholder="Add a comment…" rows={3} /><Button onClick={() => { toast.success('Comment saved in this demo session'); setSelected(null) }}>Save update</Button></aside></div>}
  </div>
}
function TeamsPage() {
  const role = usePortalStore(s => s.role), projects = usePortalStore(s => s.projects)
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || '')
  const [query, setQuery] = useState(''), [invites, setInvites] = useState<string[]>([])
  const filtered = students.filter(s => (s.name + ' ' + s.skills.join(' ')).toLowerCase().includes(query.toLowerCase()))
  if (role === 'Faculty') return <div className="page"><PageHeading title="Teams" subtitle="View the members of projects assigned to you." /><div className="toolbar-row"><label className="muted-label" htmlFor="team-project">Project</label><select id="team-project" className="select-control" value={activeProjectId} onChange={e => setActiveProjectId(e.target.value)}>{projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}</select></div>{projects.length ? projects.filter(project => project.id === activeProjectId).map(project => <section className="surface-panel" key={project.id}><div className="panel-heading"><div><h2>{project.title}</h2><p>{project.team.length} project members · view only</p></div></div>{project.team.map(name => <div className="team-roster-row" key={name}><Avatar name={name} /><div><strong>{name}</strong><small>Project team member</small></div><span className="role-chip">Member</span></div>)}</section>) : <Empty title="No assigned project teams" body="Project teams assigned to your faculty account will appear here." />}</div>
  return <div className="page"><PageHeading title="Teams" subtitle="Find the right collaborators for your next idea." action={<Button onClick={() => toast.success('Team invite flow opened')}><Plus size={17} /> Invite teammate</Button>} /><div className="toolbar-row"><div className="search-box table-search"><Search size={16} /><input placeholder="Search students or skills" aria-label="Search students or skills" value={query} onChange={e => setQuery(e.target.value)} /></div><span className="muted-label">{filtered.length} students</span></div><div className="student-grid">{filtered.map(s => <article className="student-card" key={s.id}><div className="student-card-top"><Avatar name={s.name} /><Status status={s.availability === 'Available' ? 'Available' : 'Limited availability'} /></div><h3>{s.name}</h3><p>{s.course}</p><div className="skill-chips">{s.skills.map(skill => <span key={skill}>{skill}</span>)}</div><div className="student-card-footer"><span><span className="online-dot" /> {s.availability}</span><Button variant={invites.includes(s.id) ? 'secondary' : 'primary'} onClick={() => { setInvites(old => old.includes(s.id) ? old.filter(x => x !== s.id) : [...old, s.id]); toast.success(invites.includes(s.id) ? 'Invite withdrawn' : `Invite sent to ${s.name}`) }}>{invites.includes(s.id) ? <><Check size={15} /> Invited</> : 'Invite teammate'}</Button></div></article>)}</div></div>
}
function FilesPage() {
  return <div className="page"><PageHeading title="Files" subtitle="Project documents and shared resources in one place." action={<Button onClick={() => toast.info('Real uploads need a storage service connection.')}><Plus size={17} /> Add file</Button>} /><div className="surface-panel"><div className="upload-zone" role="button" tabIndex={0} onClick={() => toast.info('Upload is a mock interaction in this prototype.')}><FileText size={26} /><strong>Drop files here or browse</strong><p>Share documents, presentations and useful links with your team.</p><small>Mock upload · no file leaves your device</small></div><div className="file-row"><span className="file-icon"><FileText size={18} /></span><div><strong>IoT campus monitor — project brief.pdf</strong><small>IoT campus monitor · 2.4 MB · Added Oct 21</small></div><button onClick={() => toast.info('Preview is not connected in demo mode.')}>Open ↗</button></div><div className="file-row"><span className="file-icon link-icon">↗</span><div><strong>Research and references</strong><small>Placement insights · Shared link</small></div><button onClick={() => toast.info('Sample link preview is not connected.')}>Open ↗</button></div></div></div>
}
function FacultyDashboard() {
  const projects = usePortalStore(s => s.projects), navigate = useNavigate()
  const overdue = usePortalStore(s => s.tasks.filter(t => t.status !== 'Done' && t.due === 'Oct 27').length)
  return <div className="page"><PageHeading title="Faculty overview" subtitle="Monitor project health, guide teams, and review milestones." action={<Button variant="secondary" onClick={() => toast.info('Report export is not connected in demo mode.')}><ArrowDownUp size={16} /> Export report</Button>} /><div className="faculty-metrics"><div className="metric"><span>Active projects</span><strong>{projects.length.toString().padStart(2, '0')}</strong><small><FolderKanban size={14} /> Across all teams</small></div><div className="metric"><span>At risk</span><strong>{projects.filter(p => p.health === 'At risk').length.toString().padStart(2, '0')}</strong><small className="metric-warning"><span>!</span> Needs attention</small></div><div className="metric"><span>Overdue projects</span><strong>{projects.filter(p => p.health === 'Overdue').length.toString().padStart(2, '0')}</strong><small className="metric-danger"><span>×</span> Past target date</small></div><div className="metric"><span>Awaiting review</span><strong>02</strong><small><GraduationCap size={14} /> Milestones submitted</small></div></div><div className="section-heading"><div><h2>All projects</h2><p>Health, progress and the next milestone for each team.</p></div><button className="button button-secondary" onClick={() => toast.info('Showing all project health states.')}><Filter size={16} /> Filter</button></div><div className="table-wrap faculty-table"><table><thead><tr><th>Project</th><th>Health</th><th>Progress</th><th>Team</th><th>Next milestone</th><th>Last activity</th></tr></thead><tbody>{projects.map(p => <tr key={p.id} onClick={() => navigate(`/project?id=${p.id}`)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate(`/project?id=${p.id}`)}><td><strong>{p.title}</strong><small className="table-subtitle">{p.summary}</small></td><td><Status status={p.health} /></td><td><Progress value={p.progress} /></td><td><div className="avatar-stack">{p.team.slice(0, 3).map(n => <Avatar key={n} name={n} size="small" />)}</div></td><td>{p.nextMilestone}<small className="table-subtitle">Due {p.due}</small></td><td>{p.lastActivity}</td></tr>)}</tbody></table></div><div className="section-heading review-heading"><div><h2>Milestones awaiting review</h2><p>Feedback helps teams move forward with confidence.</p></div><button className="text-button" onClick={() => navigate('/reviews')}>Open reviews ↗</button></div><div className="review-cards">{projects.filter(p => p.health !== 'On track').slice(0, 2).map(p => <article className="review-card" key={p.id}><div className="review-card-icon"><GraduationCap size={19} /></div><div><strong>{p.nextMilestone}</strong><p>{p.title}</p><small>Submitted by {p.team[0]} · {p.lastActivity}</small></div><Button variant="secondary" onClick={() => navigate('/reviews')}>Review work</Button></article>)}</div></div>
}
function ReviewsPage() {
  const projects = usePortalStore(s => s.projects), [active, setActive] = useState(''), [feedback, setFeedback] = useState(''); const sendReview = usePortalStore(s => s.submitReview)
  const project = projects.find(p => p.id === active) || projects.find(p => p.health !== 'On track') || projects[0]; const recordReview = async (approved: boolean) => { if (!project) return; try { await sendReview(project.id, feedback.trim() || (approved ? 'Milestone approved.' : 'Please address the requested changes and resubmit.'), approved); toast.success(approved ? 'Review saved to PostgreSQL' : 'Changes requested and saved'); setFeedback('') } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save the review.') } }
  if (!project) return <div className="page"><Empty title="No projects to review" body="Projects assigned to this faculty account will appear here." /></div>
  return <div className="page"><PageHeading title="Milestone reviews" subtitle="Review submitted work and help teams take their next step." /><div className="review-layout"><aside className="review-queue surface-panel"><div className="panel-heading"><div><h2>Review queue</h2><p>2 waiting for feedback</p></div></div>{projects.filter(p => p.health !== 'On track').map(p => <button className={`review-queue-item ${active === p.id ? 'active' : ''}`} key={p.id} onClick={() => setActive(p.id)}><span className="review-card-icon"><GraduationCap size={17} /></span><span><strong>{p.nextMilestone}</strong><small>{p.title}</small><small>Submitted by {p.team[0]}</small></span><ChevronDown size={16} /></button>)}</aside><section className="review-detail surface-panel"><div className="review-detail-head"><div><Status status="In review" /><h2>{project.nextMilestone}</h2><p>{project.title}</p></div><span className="review-date">Submitted recently</span></div><div className="submission-box"><FileText size={21} /><div><strong>Milestone submission.pdf</strong><small>Submitted by {project.team[0]} · Mock attachment</small></div><button onClick={() => toast.info('Sample submission preview is not connected.')}>Preview ↗</button></div><div className="rubric"><h3>Review rubric</h3>{['Requirements are addressed', 'Evidence and testing are included', 'Documentation is clear'].map((x, i) => <label key={x} className="rubric-row"><input type="checkbox" defaultChecked={i === 0} /><span>{x}</span><span className="rubric-score">{i === 0 ? 'Meets expectations' : 'Not reviewed'}</span></label>)}</div><label htmlFor="feedback">Feedback for the team</label><textarea id="feedback" rows={4} placeholder="Share specific, actionable feedback…" value={feedback} onChange={e => setFeedback(e.target.value)} /><div className="review-actions"><Button variant="secondary" onClick={() => void recordReview(false)}>Request changes</Button><Button onClick={() => void recordReview(true)}><Check size={16} /> Approve milestone</Button></div></section></div></div>
}
function ProfilePage() {
  const user = usePortalStore(s => s.user)
  const projects = usePortalStore(s => s.projects)
  const tasks = usePortalStore(s => s.tasks)
  const saveProfile = usePortalStore(s => s.updateProfile)
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [interests, setInterests] = useState<string[]>(user?.interests || [])
  const [skill, setSkill] = useState('')
  const [interest, setInterest] = useState('')
  const [designation, setDesignation] = useState(user?.designation || '')
  const [experience, setExperience] = useState<number | ''>(user?.experience_years ?? '')
  const [saving, setSaving] = useState(false)

  if (!user) return <div className="page"><Empty title="Profile unavailable" body="Sign in to view your account profile." /></div>

  const addValue = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, clear: (value: string) => void) => {
    const clean = value.trim()
    if (clean) {
      setter(old => old.includes(clean) ? old : [...old, clean])
      clear('')
    }
  }
  const onSave = async () => {
    setSaving(true)
    try {
      await saveProfile({
        skills,
        interests,
        ...(user.role === 'faculty' ? {
          designation: designation.trim() || null,
          experience_years: experience === '' ? null : Number(experience),
        } : {}),
      })
      toast.success('Profile saved to the database.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }
  const assignedTasks = user.role === 'student' ? tasks.filter(task => task.assigneeId === user.id) : tasks
  const completed = assignedTasks.filter(task => task.status === 'Done').length
  const completion = assignedTasks.length ? Math.round(completed / assignedTasks.length * 100) : 0
  const roleLabel = user.role === 'faculty' ? 'Faculty' : 'Student'

  return <div className="page">
    <PageHeading title="Your profile" subtitle="Your account details and collaboration profile." action={<Button onClick={() => void onSave()} disabled={saving}><Check size={16} /> {saving ? 'Saving…' : 'Save changes'}</Button>} />
    <div className="profile-layout">
      <section className="surface-panel profile-main">
        <div className="profile-hero"><Avatar name={user.name} /><div><h2>{user.name}</h2><p>{user.email}</p><span className="profile-role"><GraduationCap size={14} /> {roleLabel}</span></div></div>
        {user.role === 'faculty' && <>
          <label htmlFor="designation">Designation</label>
          <input id="designation" className="select-control" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="e.g. Assistant Professor" />
          <label htmlFor="experience">Years of experience</label>
          <input id="experience" className="select-control" type="number" min="0" step="1" value={experience} onChange={e => setExperience(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Enter years" />
        </>}
        <label>Technical skills</label>
        <div className="editable-chips">{skills.map(value => <button key={value} onClick={() => setSkills(old => old.filter(item => item !== value))}>{value}<X size={13} /></button>)}</div>
        <div className="add-skill"><input placeholder="Add a skill" value={skill} onChange={e => setSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addValue(skill, setSkills, setSkill) }} /><Button variant="secondary" onClick={() => addValue(skill, setSkills, setSkill)}><Plus size={15} /> Add skill</Button></div>
        <label>Interests</label>
        <div className="editable-chips">{interests.map(value => <button key={value} onClick={() => setInterests(old => old.filter(item => item !== value))}>{value}<X size={13} /></button>)}</div>
        <div className="add-skill"><input placeholder="Add an interest" value={interest} onChange={e => setInterest(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addValue(interest, setInterests, setInterest) }} /><Button variant="secondary" onClick={() => addValue(interest, setInterests, setInterest)}><Plus size={15} /> Add interest</Button></div>
      </section>
      <section className="surface-panel contribution-panel">
        <h2>{user.role === 'faculty' ? 'Faculty overview' : 'Contribution summary'}</h2>
        {user.role === 'student' ? <>
          <div className="contribution-number"><strong>{completed}</strong><span>assigned tasks completed</span></div>
          <Progress value={completion} label="Task completion" />
          <div className="contribution-stat"><span>Projects joined</span><strong>{projects.length}</strong></div>
          <div className="contribution-stat"><span>Open assigned tasks</span><strong>{assignedTasks.filter(task => task.status !== 'Done').length}</strong></div>
        </> : <>
          <div className="contribution-number"><strong>{projects.length}</strong><span>projects assigned</span></div>
          <div className="contribution-stat"><span>Designation</span><strong>{designation || 'Not set'}</strong></div>
          <div className="contribution-stat"><span>Experience</span><strong>{experience === '' ? 'Not set' : `${experience} years`}</strong></div>
        </>}
      </section>
    </div>
  </div>
}
function NotFound() { return <div className="page"><Empty title="This page isn’t here" body="The page may have moved or the link may be out of date." action={<Link className="button button-primary" to="/dashboard">Back to overview</Link>} /></div> }
export default function App() {
  const signedIn = usePortalStore(s => s.signedIn), role = usePortalStore(s => s.role), theme = usePortalStore(s => s.theme)
  const [ready, setReady] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = theme; setReady(true) }, [theme])
  const location = useLocation()
  if (!ready) return <div className="loading-screen"><span className="brand-mark"><GraduationCap size={22} /></span><span>Loading your workspace…</span></div>
  return <Routes><Route path="/login" element={signedIn ? <Navigate to={role === 'Faculty' ? '/faculty' : '/dashboard'} replace /> : <Login />} /><Route path="/" element={<Navigate to={signedIn ? (role === 'Faculty' ? '/faculty' : '/dashboard') : '/login'} replace />} /><Route path="*" element={signedIn ? <Shell><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/tasks" element={<TasksPage />} /><Route path="/teams" element={<TeamsPage />} /><Route path="/files" element={<FilesPage />} /><Route path="/create" element={<CreateProject />} /><Route path="/project" element={<ProjectWorkspace />} /><Route path="/faculty" element={<FacultyDashboard />} /><Route path="/reviews" element={<ReviewsPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="*" element={<NotFound />} /></Routes></Shell> : <Navigate to="/login" state={{ from: location }} replace />} /></Routes>
}






