import { CrudEventTypes, EventBus } from './event-bus';

const appEvents = new EventBus<'Scroll' | 'Repository', CrudEventTypes>();

Object.freeze(appEvents);
export default appEvents;
