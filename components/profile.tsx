type UserInfo = {
  email: string
  name: string
  nickname: string
  profileImage?: string
}

export default function Profile({ user }: { user: UserInfo }) {
  const initials = user.nickname?.slice(0, 2) || "??"
  const hasImage = !!user.profileImage

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 프로필 이미지 or 이니셜 */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 text-2xl font-bold overflow-hidden">
        {hasImage ? (
          
          <img
            src={user.profileImage}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
        
      </div>

      <div className="space-y-2 text-center">
        <div className="text-lg font-medium">
          {user.name} <span className="text-gray-400 mx-1">|</span> {user.email}
        </div>
        <div className="text-sm text-gray-600">
          <span> 닉네임: </span>{user.nickname}
        </div>
      </div>
    </div>
  )
}

