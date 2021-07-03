import { RouteComponent } from 'routes';
import { Stream } from 'xstream';
import { h2 } from '@cycle/dom';

export const About: RouteComponent = sources => ({
  dom: Stream.of(h2(['About'])),
  history: Stream.empty()
});
