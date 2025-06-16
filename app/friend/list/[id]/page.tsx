'use client'

import FollowListPage from '@/components/FollowListPage'
import { useParams } from 'next/navigation'

export default function OtherUserFollowPage() {
  const { id } = useParams()
  return <FollowListPage userId={id as string} />
}
