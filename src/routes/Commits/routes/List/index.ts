import { RouteComponent } from 'routes';
import { Stream } from 'xstream';
import { div, h2, p, ul, li, VNode } from '@cycle/dom';
import { CommitListItem } from './components/CommitListItem';

export const List: RouteComponent = ({ dom, history, github }) => {
  const commits$ = github.commits();
  const loaded$ = commits$.mapTo(true).startWith(false);
  const commitListItems$ =
    commits$.map(commits =>
      commits
        .filter(commit => !commit.commit.message.startsWith('Merge'))
        .map(commit => CommitListItem({ dom, commit$: Stream.of(commit) }))
    );
  const navigateTo$ =
    commitListItems$
      .map(clis => Stream.merge<string>(...clis.map(cli => cli.history)))
      .flatten();
  const commitListItemDoms$ =
    commitListItems$
      .map<Stream<VNode[]>>(clis => Stream.combine(...clis.map(cli => cli.dom)))
      .flatten();
  const content$ = loaded$.map(loaded =>
    loaded
      ? commitListItemDoms$.map(commits => ul(commits))
      : Stream.of(p(['Loading...']))
    ).flatten();
  const vdom$ = content$.map(content =>
    div([
      h2('Commits List'),
      content
    ])
  );
  const request$ = Stream.of('');
  return {
    dom: vdom$,
    history: navigateTo$,
    github: request$
  };
};
