type UserInfo = {
  email: string;
  name: string;
  nickname: string;
  profileImage?: string;
};

type ProfileProps = {
  user: UserInfo;
  onAIProfileClick?: () => void;
  onEditProfileClick?: () => void;
};

export default function Profile({
  user,
  onAIProfileClick,
  onEditProfileClick,
}: ProfileProps) {
  const initials = user.nickname?.slice(0, 2) || "??";
  const hasImage = !!user.profileImage;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 프로필 이미지 or 이니셜 */}
      <div className="w-30 h-30 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 text-2xl font-bold overflow-hidden">
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

      {/* 이름/이메일/닉네임 */}
      <div className="space-y-2 text-center">
        <div className="text-lg font-medium">
          {user.name} <span className="text-gray-400 mx-1">|</span> {user.email}
        </div>
        <div className="text-sm text-gray-600">
          <span>닉네임: </span>
          {user.nickname}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onAIProfileClick}
          className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100"
      
        >
          AI 프로필 설정
        </button>
        <button
          onClick={onEditProfileClick}
          className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100"
        >
          내 프로필 설정
        </button>
      </div>
    </div>
  );
}
