import React, { useState, useEffect } from 'react'

import Container from 'layouts/container';
import Bar from 'components/bar';
import Section from 'layouts/section';
import StarDetails from 'components/starDetails';
import qs from 'libs/qs';
import Button from 'components/button';
import Link from 'next/link';

const Star = () => {
  return (
    <div>
      <div>
        <Bar />
      </div>
      <Container>
        <Link href="/">
          <Button variant="exposed">Back</Button>
        </Link>

        <h1 className="page-title">Star details</h1>
        <Section>
          <StarDetails starId={qs.String("id")} />
        </Section>
      </Container>
    </div>
  )
};

export default Star;