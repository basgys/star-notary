import classNames from 'classnames'

interface Props {
  tight?: boolean
}

const Container = (props: Props & React.HTMLAttributes<any>) => (
  <div className={classNames("container", props.tight && "container--tight", props.className)}>
    {props.children}
  </div>
);

export default Container;