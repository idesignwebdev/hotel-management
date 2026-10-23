import { useApp } from '../../store/appContext.jsx';
import Avatar from '../common/Avatar.jsx';

/**
 * Kanban-style housekeeping task board grouped by status.
 */
export default function TaskBoard({ rows, visible, statuses, status, busy, advance, canManage = false }) {
  return (
    <div className="task-board">
      {statuses.map((group) => {
        const tasks = visible.filter((t) => t.status === group);
        return (
          <section className="task-column" key={group}>
            <header><b>{group}</b><span>{tasks.length}</span></header>
            {tasks.length ? tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-card-top">
                  <span className={`pill pill-${task.priority.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{task.priority}</span>
                  <span>{task.due}</span>
                </div>
                <h3>Room {task.room}</h3>
                <p>{task.type}</p>
                <div className="task-assignee"><span className="mini-avatar">{task.assignee.split(/\s+/).slice(0, 2).map((x) => x[0] || '').join('').toUpperCase()}</span>{task.assignee}</div>
                {canManage && group !== 'Ready' && (
                  <button disabled={busy || group === 'Blocked'} className="task-advance" onClick={() => advance(task)}>
                    {group === 'Blocked' ? 'Maintenance blocker' : 'Advance task →'}
                  </button>
                )}
              </article>
            )) : <div className="task-empty">No tasks</div>}
          </section>
        );
      })}
    </div>
  );
}
