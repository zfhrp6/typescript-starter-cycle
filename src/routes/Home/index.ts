import { RouteComponent } from 'routes';
import { Stream } from 'xstream';
import { h2 } from '@cycle/dom';

export const Home: RouteComponent = () => ({
  dom: Stream.of(h2(['Home'])),
  history: Stream.empty(),
});
