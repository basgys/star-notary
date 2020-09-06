import { useEffect, useState } from "react";
import Link from "next/link";

import StarNotary from "contracts/StarNotary.json";
import Section from "layouts/section";
import Card, { CardHeaderTitle, CardHeader, CardHeaderActions } from "components/card";
import { useAccount } from "hooks/useAccount";
import { useContract } from "hooks/useContract";
import Star from "models/star";
import Button from "components/button";
import Buttons from "components/buttongroup";
import { useWeb3 } from "hooks/useWeb3";

interface Props {}

export const Stars = (props: Props & React.HTMLAttributes<any>) => (
  <Section className="stars">
    {props.children}
  </Section>
);

export default Stars;

interface ItemProps {
  starId: string
  canSell?: boolean
  canBuy?: boolean
  canTransfer?: boolean

  onTransferInitiated?: () => void
}

export const StarItem = (props: ItemProps & React.HTMLAttributes<any>) => {
  const web3 = useWeb3();
  const account = useAccount();
  const starNotary = useContract(StarNotary);
  const [error, setError] = useState<any>();
  const [star, setStar] = useState<Star | undefined>();

  const update = () => {
    starNotary.instance?.methods.lookUptokenIdToStarInfo(props.starId).call((err: any, info: any) => {
      if (err) {
        setError(err);
        return
      }
      const star = new Star(props.starId, info[0], info[1]);
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
  const transfer = () => {
    props.onTransferInitiated && props.onTransferInitiated();
  }
  const sell = () => {
    // TODO: Allow to customise value
    starNotary.instance?.methods.putStarUpForSale(props.starId, "1").send({
      from: account,
    }).then((err: any, res: any) => {
      update();
    });
  }
  const buy = () => {
    starNotary.instance?.methods.buyStar(props.starId).send({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    }).then((err: any, res: any) => {
      update();
    });
  }

  useEffect(() => {
    update();
  }, [starNotary, account])

  if (error) {
    return (
      <Card className="stars__item">
        <CardHeaderTitle>{error.message}</CardHeaderTitle>
      </Card>
    )
  }
  if (!star) {
    return (
      <Card className="stars__item">
        <CardHeaderTitle>Loading...</CardHeaderTitle>
      </Card>
    )
  }

  return (
    <Card className="stars__item">
      <CardHeader>
        <CardHeaderTitle>
          <h1>{star?.name}</h1>
          <h2>{star?.id}</h2>
        </CardHeaderTitle>
        <CardHeaderActions>
          <Buttons noVerticalSpace>
            <Link href="/star/[id]" as={`/star/${star.id}`}>
              <Button size="small">Details</Button>
            </Link>
            {props.canSell && star?.price === undefined && <Button size="small" onClick={sell}>Sell</Button>}
            {props.canTransfer && star?.price === undefined && <Button size="small" onClick={transfer}>Transfer</Button>}
            {props.canBuy && star?.price !== undefined && <Button size="small" onClick={buy}>Buy for SNY {star?.price}</Button>}
          </Buttons>
        </CardHeaderActions>
      </CardHeader>
    </Card>
  )
};
