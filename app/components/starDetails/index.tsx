import StarNotary from "contracts/StarNotary.json";
import { useEffect, useState } from "react";
import { useAccount } from "hooks/useAccount";
import { useContract } from "hooks/useContract";
import Star from "models/star";
import PageLoader from "components/pageloader";

interface Props {
  starId: string
}

export const StarDetails = (props: Props & React.HTMLAttributes<any>) => {
  const { starId } = props;

  const account = useAccount();
  const starNotary = useContract(StarNotary);
  const [error, setError] = useState<any>();
  const [star, setStar] = useState<Star | undefined>();

  const update = () => {
    const id = parseInt(starId)
    if (isNaN(id)) return

    starNotary.instance?.methods.lookUptokenIdToStarInfo(id).call((err: any, info: any) => {
      if (err) {
        setError(err);
        return
      }
      if (!info || !info[0]) {
        setError(new Error("Star not found"));
        return
      }

      const star = new Star(id, info[0], info[1]);
      const onSale = info[2];
      const price = info[3];
      if (onSale) {
        star.onSale = true;
        star.price = price;
      }

      setError(undefined);
      setStar(star);
    });
  }
  useEffect(() => {
    update();
  }, [starNotary, account, starId])

  if (error) {
    return (
      <div className="star">
        <h1 className="title">Ooops 😢</h1>
        <h2 className="subtitle">Something went wrong</h2>

        <p>{error.message}</p>
      </div>
    )
  }
  if (!star) {
    return (
      <div className="star">
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="star">
      <h1 className="title">{star.id} - {star.name}</h1>
      <h2 className="subtitle">{star.owner}</h2>

      {star.onSale && `On sale at ${star.price} SNY`}
    </div>
  )
};

export default StarDetails;