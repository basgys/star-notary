import React, { useEffect, useState } from 'react'
import Container from 'layouts/container';

import StarNotary from "contracts/StarNotary.json";
import { useContract } from 'hooks/useContract';
import Bar from 'components/bar';
import Stars, { StarItem } from 'components/stars';
import Section from 'layouts/section';
import Tab, { TabLink } from 'components/tab';
import { useAccount } from 'hooks/useAccount';
import Dialogue, { DialogueContent, DialogueTitle } from 'components/dialogue';
import InitTransfer from 'components/initTransfer';

const Index = () => {
  const starNotary = useContract(StarNotary);
  const account = useAccount();
  const [stars, setStars] = useState<string[]>([]);
  const [transfer, setTransfer] = useState<string>("");

  const onTransferInitiated = (starId: string) => () => {
    setTransfer(starId);
  }

  useEffect(() => {
    if (!account) return

    starNotary.instance?.methods.getStars(account).call((err: any, stars: any) => {
      setStars(stars || []);
    });
  }, [starNotary, account])

  return (
    <div>
      <div>
        <Bar />
      </div>
      <Container>
        <Tab>
          <TabLink href="/" active>Your stars</TabLink>
          <TabLink href="/sales">Stars on sale</TabLink>
        </Tab>

        <Section>
          <Stars>
            {stars.map((starId) => (
              <StarItem
                key={starId}
                starId={starId}
                onTransferInitiated={onTransferInitiated(starId)}
                canSell
                canTransfer
              />
            ))}
          </Stars>
        </Section>

        <Dialogue open={!!transfer}>
          <DialogueTitle>Transfer</DialogueTitle>
          <DialogueContent>
              <InitTransfer
                starId={transfer}
                onInitiated={() => setTransfer("")}
                onCancel={() => setTransfer("")}
              />
          </DialogueContent>
        </Dialogue>
      </Container>
    </div>
  )
};

export default Index;