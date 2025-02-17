import { Stream, MemoryStream } from 'xstream';
import { DOMSource, VNode, div, h1, em, br } from '@cycle/dom';
import { style } from 'typestyle';
import { rem } from 'csx';
import { Location } from '@cycle/history';
import { NavMenu } from './NavMenu';

interface Sources {
  dom: DOMSource;
  history: MemoryStream<Location>;
}

interface Sinks {
  dom: Stream<VNode>;
}

const className = style({
  display: 'flex',
  $nest: {
    '& h1': {
      marginBottom: 0,
      marginTop: 0,
      flex: '1 0 60%',
      lineHeight: 1,
    },
    '& em': {
      fontSize: rem(1),
    },
    '& nav': {
      flex: 1,
    },
  },
});

export const Header = ({ dom, history }: Sources): Sinks => {
  const navMenu = NavMenu({ dom, history });
  const vdom$ = navMenu.dom.map((navMenu) =>
    div(`.${className}`, [
      h1([
        'TypeScript Starter Cycle',
        br(),
        em('An opinionated starter for Cycle.js projects powered by TypeScript'),
      ]),
      navMenu,
    ])
  );
  return {
    dom: vdom$,
  };
};
