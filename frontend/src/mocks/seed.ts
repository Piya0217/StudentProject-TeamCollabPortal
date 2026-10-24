import type { Project, Student, Task } from '../types'

export const students: Student[] = [
  { id: '1', name: 'Alice Johnson', initials: 'AJ', course: 'Computer Science', skills: ['React', 'Node.js', 'PostgreSQL'], availability: 'Available' },
  { id: '2', name: 'Bob Smith', initials: 'BS', course: 'Computer Science', skills: ['Python', 'Machine Learning'], availability: 'Available' }
]
export const projects: Project[] = [
  { id: 'p1', title: 'IoT campus monitor', summary: 'A sensor network for smarter campus facilities.', health: 'On track', progress: 68, due: 'Nov 18, 2026', team: ['Aarav Sharma', 'Kabir Rao', 'Meera Iyer'], nextMilestone: 'Sensor integration', lastActivity: '12 min ago', milestones: [{id:'m1',title:'Problem research',due:'Oct 10',status:'Complete'},{id:'m2',title:'Sensor integration',due:'Nov 02',status:'In review'},{id:'m3',title:'Campus pilot',due:'Nov 18',status:'Upcoming'}] },
  { id: 'p2', title: 'Placement insights', summary: 'Explore placement outcomes through student data.', health: 'At risk', progress: 42, due: 'Nov 12, 2026', team: ['Diya Nair', 'Aarav Sharma'], nextMilestone: 'Model evaluation', lastActivity: '1 hour ago', milestones: [{id:'m4',title:'Data collection',due:'Oct 04',status:'Complete'},{id:'m5',title:'Model evaluation',due:'Oct 29',status:'Upcoming'},{id:'m6',title:'Final report',due:'Nov 12',status:'Upcoming'}] },
  { id: 'p3', title: 'Accessible campus map', summary: 'Help students find accessible routes and facilities.', health: 'On track', progress: 81, due: 'Nov 26, 2026', team: ['Meera Iyer', 'Diya Nair'], nextMilestone: 'Usability testing', lastActivity: 'Yesterday', milestones: [{id:'m7',title:'User interviews',due:'Oct 02',status:'Complete'},{id:'m8',title:'Usability testing',due:'Nov 05',status:'Upcoming'},{id:'m9',title:'Release candidate',due:'Nov 26',status:'Upcoming'}] },
  { id: 'p4', title: 'Smart mobility prototype', summary: 'A data-led prototype for campus traffic flow.', health: 'Overdue', progress: 27, due: 'Oct 20, 2026', team: ['Kabir Rao', 'Diya Nair'], nextMilestone: 'Prototype review', lastActivity: '2 days ago', milestones: [{id:'m10',title:'Requirements',due:'Sep 22',status:'Complete'},{id:'m11',title:'Prototype review',due:'Oct 20',status:'In review'},{id:'m12',title:'Demo day',due:'Nov 04',status:'Upcoming'}] }
]
const titles = ['Map sensor readings','Review interview notes','Prepare interface draft','Validate sample data','Write milestone summary','Test responsive layout','Document API assumptions','Collect faculty feedback','Update project timeline','Check edge cases','Review team contribution','Prepare demo slides','Run usability session','Refine task estimates','Submit prototype link','Verify sensor readings','Draft final report','Check accessibility','Update dataset','Review dashboard metrics','Prepare test cases','Organise project files','Summarise findings','Resolve open feedback','Record demo walkthrough','Check deadline risks','Update readme','Final quality review']
const statuses: Task['status'][] = ['To do','In progress','In review','Done']
const priorities: Task['priority'][] = ['High','Medium','Low']
export const seedTasks: Task[] = titles.map((title, i) => ({
  id: `t${i+1}`, title, projectId: `p${(i%4)+1}`, assignee: students[i%students.length].name,
  status: statuses[i%4], priority: priorities[i%3], due: ['Oct 27','Oct 29','Nov 02','Nov 05'][i%4],
  description: `${title} for the project team. Add findings, check assumptions, and leave a short update for the next teammate.`,
  comments: i%3===0 ? ['I have added the first pass. Please review before the next milestone.'] : []
}))
