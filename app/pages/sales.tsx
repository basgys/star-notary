import React, { useState, useEffect } from 'react'

import Container from 'layouts/container';
import StarNotary from "contracts/StarNotary.json";
import { useContract } from 'hooks/useContract';
import Bar from 'components/bar';
import Section from 'layouts/section';
import Tab, { TabLink } from 'components/tab';
import Stars, { StarItem } from 'components/stars';

const Sales = () => {
  const starNotary = useContract(StarNotary);
  const [stars, setStars] = useState<string[]>([]);

  useEffect(() => {
    starNotary.instance?.methods.getSales().call((err: any, stars: any) => {
      setStars(stars || []);
    });
  }, [starNotary])


  return (
    <div>
      <div>
        <Bar />
      </div>
      <Container>
        <Tab>
          <TabLink href="/">Your stars</TabLink>
          <TabLink href="/sales" active>Stars on sale</TabLink>
        </Tab>

        <Section>
          <Stars>
            {stars.map((starId) => (
              <StarItem key={starId} starId={starId} canBuy />
            ))}
          </Stars>
        </Section>
      </Container>
    </div>
  )
};

export default Sales;