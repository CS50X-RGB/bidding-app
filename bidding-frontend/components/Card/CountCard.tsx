import React from 'react'
import { Card,CardBody } from '@heroui/react'
import { CountCardProps } from '@/types'

export const CountCard = ({count,title}: CountCardProps) => {
  return (
    <Card className='w-1/4 ' radius='lg' shadow='md'>
        <CardBody className='flex flex-col justify-center p-1 space-y-3 text-center'>
            <p>{title}</p>
            <p className='text-2xl font-semibold text-green-600'> {count}</p>
        </CardBody>
    </Card>
  )
}
