import React from 'react';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';


export type CountCardProps = {
  count: number;
  title: string;
  href?: string;
};

export const CountCard = ({ count, title, href }: CountCardProps) => {
 return(
    <Card className="w-1/4 cursor-pointer hover:shadow-lg transition-shadow" radius="lg" shadow="md">
      
      <CardBody className="flex flex-col justify-center p-1 space-y-3 text-center h-max">
        <a href={href}>
        <p>{title}</p>
        <p className="text-2xl font-semibold text-green-600">{count}</p>
        </a>
      </CardBody>
    </Card>
  );

  // return href ? (
  //   <Link href={href} className="block w-full">
  //     {content}
  //   </Link>
  // ) : (
  //   content
  // );
};
