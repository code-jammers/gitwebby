import { CrudEventTypes, EventBus } from './event-bus';

const appEvents = new EventBus<'Scroll', CrudEventTypes | 'Repo' | 'Commit'>();

Object.freeze(appEvents);
export default appEvents;
