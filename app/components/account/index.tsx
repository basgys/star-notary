import { useAccount } from "hooks/useAccount";

export const Account = (props: React.HTMLAttributes<any>) => {
  const account = useAccount();

  return (
    <div className='account'>{account}</div>
  )
};

export default Account;