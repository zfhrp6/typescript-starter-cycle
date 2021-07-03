import { Stream, MemoryStream } from 'xstream';
import { MainDOMSource, VNode, div } from '@cycle/dom';
import { HistoryInput, Location } from '@cycle/history';
import { resolve } from 'routes';
import { pluck } from 'utils/pluck';
import { GithubSource } from 'drivers/github';

export interface Sources {
  dom: MainDOMSource;
  history: MemoryStream<Location>;
  github: GithubSource;
}

export interface Sinks {
  dom: Stream<VNode>;
  history: Stream<HistoryInput | string>;
  github: Stream<string>;
}

export const App = (sources: Sources): Sinks => {
  const app$ =
    sources.history
      .map(location => resolve(location.pathname))
      .map(({ getComponent, getLayout, ...resolution }) =>
        Stream.fromPromise(
          getComponent()
            .then(Component => Component({ ...sources, ...(resolution.sources || {}) }))
            .then(component =>
              !getLayout
                ? Promise.resolve(component)
                : getLayout().then(Layout => Layout({ ...sources, component }))
          )
        )
      )
      .flatten();
  return {
    dom: pluck(app$, app$ => app$.dom),
    history: pluck(app$, app$ => app$.history),
    github: pluck(app$, app$ => app$.github)
  };
};
