import axios from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ,
})

// ✅ 요청 인터셉터: accessToken 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ 응답 인터셉터: accessToken 만료 시 → refreshToken으로 재요청
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // accessToken 만료시
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/reissue`, {
          refreshToken,
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Authorization 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // 원래 요청 재시도
        return instance(originalRequest)
      } catch (refreshError) {
        // refresh 실패 → 로그아웃 처리
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default instance

