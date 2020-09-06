import classNames from 'classnames'

interface Props extends React.TextareaHTMLAttributes<any> {}

const Textarea = (props: Props & React.HTMLAttributes<any>) => {
  const { className, ...rest } = props;
  return (
    <textarea className={classNames('textarea', className)} {...rest} />
  )
};

export default Textarea;